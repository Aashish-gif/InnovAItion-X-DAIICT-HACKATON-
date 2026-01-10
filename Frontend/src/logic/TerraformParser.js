/**
 * Parses HCL (HashiCorp Configuration Language) Terraform code to React Flow nodes and edges
 * @param {string} hclCode - The Terraform HCL code to parse
 * @returns {Object} Object containing nodes and edges arrays
 */
export function parseHCLtoNodes(hclCode) {
  const nodes = [];
  const edges = [];
  
  // Regular expression to match resource declarations
  // Matches: resource "resource_type" "name" { ... }
  const resourceRegex = /resource\s+"([^"]+)"\s+"([^"]+)"\s+\{([^}]+?)\}/gs;
  
  let match;
  let nodeIdCounter = 0;
  
  while ((match = resourceRegex.exec(hclCode)) !== null) {
    const resourceType = match[1]; // e.g., "aws_instance"
    const resourceName = match[2]; // e.g., "web_server"
    const resourceBody = match[3]; // The content inside the braces
    
    // Convert resource type to a suitable node type
    const nodeType = getResourceNodeType(resourceType);
    
    // Create a node object
    const node = {
      id: `${resourceType}_${resourceName}`,
      type: nodeType,
      position: { x: (nodeIdCounter % 5) * 200, y: Math.floor(nodeIdCounter / 5) * 150 }, // Arrange nodes in a grid
      data: {
        label: resourceName,
        terraformType: resourceType,
        config: parseResourceAttributes(resourceBody)
      }
    };
    
    nodes.push(node);
    nodeIdCounter++;
  }
  
  // After parsing all resources, create edges based on references
  createEdgesFromReferences(nodes, edges, hclCode);
  
  return { nodes, edges };
}

/**
 * Maps Terraform resource types to React Flow node types
 * @param {string} resourceType - The Terraform resource type
 * @returns {string} The corresponding node type
 */
function getResourceNodeType(resourceType) {
  const typeMap = {
    'aws_instance': 'ec2',
    'aws_s3_bucket': 's3',
    'aws_db_instance': 'rds',
    'aws_lambda_function': 'lambda',
    'aws_vpc': 'vpc',
    'aws_subnet': 'subnet',
    'aws_security_group': 'security_group',
    'aws_internet_gateway': 'internet_gateway',
    'aws_route_table': 'route_table',
    'aws_nat_gateway': 'nat_gateway',
    'aws_lb': 'load_balancer',
    'aws_autoscaling_group': 'autoscaling_group',
    'aws_iam_role': 'iam_role',
    'aws_elasticache_cluster': 'elasticache',
    'aws_dynamodb_table': 'dynamodb',
    'aws_api_gateway_rest_api': 'api_gateway',
    'aws_efs_file_system': 'efs',
    'aws_kms_key': 'kms',
    'aws_cloudwatch_log_group': 'cloudwatch'
  };
  
  return typeMap[resourceType] || 'generic_resource';
}

/**
 * Parses resource attributes from the resource body
 * @param {string} resourceBody - The body of the resource block
 * @returns {Object} Parsed attributes
 */
function parseResourceAttributes(resourceBody) {
  const attributes = {};
  
  // Match attribute assignments like: key = "value" or key = variable
  const attrRegex = /(\w+)\s*=\s*(("[^"]*")|([a-zA-Z0-9_.]+))/g;
  
  let attrMatch;
  while ((attrMatch = attrRegex.exec(resourceBody)) !== null) {
    const key = attrMatch[1];
    const value = attrMatch[2].startsWith('"') ? attrMatch[2].slice(1, -1) : attrMatch[2]; // Remove quotes if present
    attributes[key] = value;
  }
  
  return attributes;
}

/**
 * Creates edges based on resource references in the HCL code
 * @param {Array} nodes - The parsed nodes
 * @param {Array} edges - The edges array to populate
 * @param {string} hclCode - The original HCL code
 */
function createEdgesFromReferences(nodes, edges, hclCode) {
  // Create a map of resource identifiers to node IDs for easier lookup
  const resourceToNodeIdMap = {};
  nodes.forEach(node => {
    // Extract resource type and name from node ID (format: resource_type_resource_name)
    const parts = node.id.split('_');
    if (parts.length >= 2) {
      // Handle the case where resource name is multiple words joined by underscores
      for (let i = 1; i < parts.length; i++) {
        const potentialResourceType = parts.slice(0, i).join('_');
        const potentialResourceName = parts.slice(i).join('_');
        
        if (potentialResourceType.startsWith('aws')) {
          resourceToNodeIdMap[`${potentialResourceType}.${potentialResourceName}`] = node.id;
          break;
        }
      }
    }
  });

  // Look for references in the HCL code
  // Pattern: resource_type.resource_name.attribute or resource_type.resource_name
  const referenceRegex = /(aws_[^\s]+)\.([a-zA-Z0-9_-]+(?:\.[a-zA-Z0-9_-]+)*)/g;
  
  let refMatch;
  while ((refMatch = referenceRegex.exec(hclCode)) !== null) {
    const referencedType = refMatch[1];
    const referencedName = refMatch[2].split('.')[0]; // Get just the resource name, not the attribute
    const fullReference = `${referencedType}.${referencedName}`;
    
    // Check if this reference exists in our nodes
    if (resourceToNodeIdMap[fullReference]) {
      // Find which resource is referencing this
      // We need to find a resource that contains this reference in its attributes
      const referencingNode = findReferencingNode(hclCode, fullReference);
      
      if (referencingNode && resourceToNodeIdMap[referencingNode]) {
        // Create an edge from the referencing resource to the referenced resource
        const edgeId = `edge-${resourceToNodeIdMap[referencingNode]}-${resourceToNodeIdMap[fullReference]}`;
        
        // Avoid duplicate edges
        const edgeExists = edges.some(edge => 
          edge.source === resourceToNodeIdMap[referencingNode] && 
          edge.target === resourceToNodeIdMap[fullReference]
        );
        
        if (!edgeExists) {
          edges.push({
            id: edgeId,
            source: resourceToNodeIdMap[referencingNode],
            target: resourceToNodeIdMap[fullReference],
            type: 'smoothstep',
            animated: true,
            style: {
              stroke: '#0066cc',
            },
            markerEnd: {
              type: 'arrowclosed',
              color: '#0066cc',
            },
          });
        }
      }
    }
  }
}

/**
 * Finds which resource is referencing a particular resource
 * @param {string} hclCode - The HCL code
 * @param {string} reference - The reference to look for
 * @returns {string|null} The referencing resource identifier or null
 */
function findReferencingNode(hclCode, reference) {
  // Look for the reference in the HCL code
  const escapedRef = reference.replace(/[.*+?^${}()|\[\]]/g, '\$&');
  
  // Find all occurrences of the reference
  const regex = new RegExp(escapedRef, 'g');
  let match;
  
  while ((match = regex.exec(hclCode)) !== null) {
    // Find the resource block that contains this usage
    const pos = match.index;
    
    // Find the nearest resource declaration before this position
    const resourceBefore = findNearestResourceDeclaration(hclCode, pos);
    if (resourceBefore) {
      return resourceBefore;
    }
  }
  
  return null;
}

/**
 * Finds the nearest resource declaration before a given position
 * @param {string} hclCode - The HCL code
 * @param {number} position - The position to search from
 * @returns {string|null} The resource identifier or null
 */
function findNearestResourceDeclaration(hclCode, position) {
  // Look backwards from the position to find a resource declaration
  const codeUpToPos = hclCode.substring(0, position);
  const resourceRegex = /resource\s+"([^"]+)"\s+"([^"]+)"/g;
  
  let lastMatch = null;
  let match;
  
  while ((match = resourceRegex.exec(codeUpToPos)) !== null) {
    lastMatch = `${match[1]}.${match[2]}`; // resource_type.resource_name
  }
  
  return lastMatch;
}