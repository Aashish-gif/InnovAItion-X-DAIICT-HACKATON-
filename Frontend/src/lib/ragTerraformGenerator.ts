import { Node } from 'reactflow';

interface TerraformResource {
  id: string;
  type: string;
  attributes: Record<string, any>;
  dependencies?: string[];
}

interface RagKnowledgeBase {
  [key: string]: {
    terraformTemplate: string;
    examples: string[];
    bestPractices: string[];
    requiredFields: string[];
    optionalFields: string[];
  };
}

// Knowledge base with Terraform templates and examples
const knowledgeBase: RagKnowledgeBase = {
  'aws_instance': {
    terraformTemplate: `resource "aws_instance" "{{name}}" {
  ami           = "{{ami}}"
  instance_type = "{{instance_type}}"
{{#vpc_security_group_ids}}
  vpc_security_group_ids = [{{vpc_security_group_ids}}]
{{/vpc_security_group_ids}}
{{#subnet_id}}
  subnet_id = "{{subnet_id}}"
{{/subnet_id}}

  tags = {
    Name = "{{name}}"
    ManagedBy = "CloudArchitectAI"
  }
}`,
    examples: [
      `resource "aws_instance" "{{name}}" {
  ami           = "{{ami}}"
  instance_type = "{{instance_type}}"
  key_name      = "{{key_name}}"

  vpc_security_group_ids = [aws_security_group.web.id]
  subnet_id              = aws_subnet.public.id

  tags = {
    Name        = "{{name}}"
    Environment = "production"
    ManagedBy   = "CloudArchitectAI"
  }
}`
    ],
    bestPractices: [
      'Always specify AMI ID explicitly',
      'Use instance types appropriate for workload',
      'Attach to proper VPC and subnets',
      'Include security groups',
      'Tag resources appropriately'
    ],
    requiredFields: ['ami', 'instance_type'],
    optionalFields: ['key_name', 'vpc_security_group_ids', 'subnet_id', 'tags']
  },
  'aws_s3_bucket': {
    terraformTemplate: `resource "aws_s3_bucket" "{{name}}" {
  bucket = "{{bucket_name}}"

  tags = {
    Name = "{{name}}"
    ManagedBy = "CloudArchitectAI"
  }
}

resource "aws_s3_bucket_versioning" "{{name}}_versioning" {
  bucket = aws_s3_bucket.{{name}}.id
  versioning_configuration {
    status = "{{versioning_status}}"
  }
}`,
    examples: [
      `resource "aws_s3_bucket" "{{name}}" {
  bucket = "{{bucket_name}}"

  tags = {
    Name        = "{{name}}"
    Environment = "production"
    ManagedBy   = "CloudArchitectAI"
  }
}

resource "aws_s3_bucket_versioning" "{{name}}_versioning" {
  bucket = aws_s3_bucket.{{name}}.id
  versioning_configuration {
    status = "{{versioning_status}}"
  }
}`
    ],
    bestPractices: [
      'Enable versioning for important buckets',
      'Use appropriate bucket naming conventions',
      'Configure lifecycle policies',
      'Set up server-side encryption'
    ],
    requiredFields: ['bucket'],
    optionalFields: ['tags', 'versioning', 'lifecycle_rule', 'server_side_encryption_configuration']
  },
  'aws_vpc': {
    terraformTemplate: `resource "aws_vpc" "{{name}}" {
  cidr_block           = "{{cidr_block}}"
  enable_dns_hostnames = {{enable_dns_hostnames}}
  enable_dns_support   = {{enable_dns_support}}

  tags = {
    Name = "{{name}}"
    ManagedBy = "CloudArchitectAI"
  }
}`,
    examples: [
      `resource "aws_vpc" "{{name}}" {
  cidr_block           = "{{cidr_block}}"
  enable_dns_hostnames = {{enable_dns_hostnames}}
  enable_dns_support   = {{enable_dns_support}}

  tags = {
    Name        = "{{name}}"
    Environment = "production"
    ManagedBy   = "CloudArchitectAI"
  }
}`
    ],
    bestPractices: [
      'Use appropriate CIDR blocks',
      'Enable DNS hostnames and support',
      'Tag VPCs consistently',
      'Consider IP address planning'
    ],
    requiredFields: ['cidr_block'],
    optionalFields: ['enable_dns_hostnames', 'enable_dns_support', 'tags', 'instance_tenancy']
  },
  'aws_security_group': {
    terraformTemplate: `resource "aws_security_group" "{{name}}" {
  name        = "{{name}}"
  description = "{{description}}"
  vpc_id      = "{{vpc_id}}"

{{#ingress_rules}}
  ingress {
    from_port   = {{from_port}}
    to_port     = {{to_port}}
    protocol    = "{{protocol}}"
    cidr_blocks = [{{cidr_blocks}}]
  }
{{/ingress_rules}}

{{#egress_rules}}
  egress {
    from_port   = {{from_port}}
    to_port     = {{to_port}}
    protocol    = "{{protocol}}"
    cidr_blocks = [{{cidr_blocks}}]
  }
{{/egress_rules}}

  tags = {
    Name = "{{name}}"
    ManagedBy = "CloudArchitectAI"
  }
}`,
    examples: [
      `resource "aws_security_group" "{{name}}" {
  name        = "{{name}}"
  description = "{{description}}"
  vpc_id      = "{{vpc_id}}"

  ingress {
    from_port   = {{from_port}}
    to_port     = {{to_port}}
    protocol    = "{{protocol}}"
    cidr_blocks = [{{cidr_blocks}}]
  }

  egress {
    from_port   = {{from_port}}
    to_port     = {{to_port}}
    protocol    = "{{protocol}}"
    cidr_blocks = [{{cidr_blocks}}]
  }

  tags = {
    Name        = "{{name}}"
    Environment = "production"
    ManagedBy   = "CloudArchitectAI"
  }
}`
    ],
    bestPractices: [
      'Follow principle of least privilege',
      'Use specific ports instead of wide-open rules',
      'Tag security groups appropriately',
      'Regularly review security group rules'
    ],
    requiredFields: ['name', 'vpc_id'],
    optionalFields: ['description', 'ingress', 'egress', 'tags']
  },
  'aws_db_instance': {
    terraformTemplate: `resource "aws_db_instance" "{{name}}" {
  identifier                = "{{identifier}}"
  allocated_storage         = {{allocated_storage}}
  max_allocated_storage     = {{max_allocated_storage}}
  storage_type              = "{{storage_type}}"
  engine                    = "{{engine}}"
  engine_version            = "{{engine_version}}"
  instance_class            = "{{instance_class}}"
  db_name                   = "{{db_name}}"
  username                  = "{{username}}"
  password                  = "{{password}}"
  skip_final_snapshot       = {{skip_final_snapshot}}
{{#vpc_security_group_ids}}
  vpc_security_group_ids = [{{vpc_security_group_ids}}]
{{/vpc_security_group_ids}}

  tags = {
    Name = "{{name}}"
    ManagedBy = "CloudArchitectAI"
  }
}`,
    examples: [
      `resource "aws_db_instance" "{{name}}" {
  identifier                = "{{identifier}}"
  allocated_storage         = {{allocated_storage}}
  max_allocated_storage     = {{max_allocated_storage}}
  storage_type              = "{{storage_type}}"
  engine                    = "{{engine}}"
  engine_version            = "{{engine_version}}"
  instance_class            = "{{instance_class}}"
  db_name                   = "{{db_name}}"
  username                  = "{{username}}"
  password                  = "{{password}}"
  skip_final_snapshot       = {{skip_final_snapshot}}
  vpc_security_group_ids    = [aws_security_group.db.id]

  tags = {
    Name        = "{{name}}"
    Environment = "production"
    ManagedBy   = "CloudArchitectAI"
  }
}`
    ],
    bestPractices: [
      'Use parameter groups for database configuration',
      'Enable backup and maintenance windows',
      'Use IAM database authentication when possible',
      'Store passwords in secrets manager',
      'Monitor storage capacity'
    ],
    requiredFields: ['identifier', 'engine', 'instance_class', 'username', 'password'],
    optionalFields: ['allocated_storage', 'backup_retention_period', 'backup_window', 'maintenance_window', 'vpc_security_group_ids']
  }
};

// Simple similarity function to find the best matching resource template
const findBestMatch = (resourceType: string): string | null => {
  // Direct match first
  if (knowledgeBase[resourceType]) {
    return resourceType;
  }
  
  // Try to find a partial match
  const keys = Object.keys(knowledgeBase);
  for (const key of keys) {
    if (resourceType.includes(key) || key.includes(resourceType.split('_')[1])) {
      return key;
    }
  }
  
  return null;
};

// Simple template engine to replace placeholders
const renderTemplate = (template: string, data: any): string => {
  let result = template;
  
  // Replace simple placeholders
  Object.entries(data).forEach(([key, value]) => {
    const placeholder = new RegExp(`{{${key}}}`, 'g');
    result = result.replace(placeholder, String(value));
  });
  
  // Handle conditional blocks (simple implementation)
  const conditionalRegex = /{{#(\w+)}}([\s\S]*?){{\/\1}}/g;
  result = result.replace(conditionalRegex, (match, condition, content) => {
    const conditionValue = data[condition];
    if (conditionValue) {
      // Replace values within the conditional block
      let renderedContent = content;
      Object.entries(data).forEach(([key, value]) => {
        const placeholder = new RegExp(`{{${key}}}`, 'g');
        renderedContent = renderedContent.replace(placeholder, String(value));
      });
      return renderedContent;
    }
    return '';
  });
  
  return result;
};

/**
 * Generates Terraform code using RAG (Retrieval Augmented Generation) approach
 * @param nodes - The nodes from the ReactFlow diagram
 * @returns Generated Terraform code
 */
export const generateTerraformWithRag = async (nodes: Node[]): Promise<string> => {
  if (nodes.length === 0) {
    return `# Cloud Architect - Terraform Configuration
# Drag AWS resources to the canvas to generate code

terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = "us-east-1"
}

# Your infrastructure code will appear here...
`;
  }

  let terraformCode = `# Generated by Cloud Architect AI
# Cloud Architect - Terraform Configuration
# Generated using RAG (Retrieval Augmented Generation)

terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = "us-east-1"
}

`;

  // First, handle VPC resources (as they are typically dependencies)
  const vpcNodes = nodes.filter(node => 
    node.data?.terraformType === 'aws_vpc' || 
    node.data?.type === 'vpc' || 
    node.type === 'vpcGroup'
  );

  for (const node of vpcNodes) {
    const resourceData = node.data as any;
    const resourceName = resourceData.label.toLowerCase().replace(/[^a-z0-9]/g, '_');
    const config = resourceData.config || {};
    
    const matchedType = findBestMatch(resourceData.terraformType || 'aws_vpc');
    if (matchedType) {
      const templateData = {
        name: resourceName,
        cidr_block: config.cidr_block || '10.0.0.0/16',
        enable_dns_hostnames: config.enable_dns_hostnames ?? true,
        enable_dns_support: config.enable_dns_support ?? true,
      };
      
      const resourceCode = renderTemplate(knowledgeBase[matchedType].terraformTemplate, templateData);
      terraformCode += resourceCode + '\n\n';
    }
  }

  // Then handle other resources
  const otherNodes = nodes.filter(node => 
    node.data?.terraformType !== 'aws_vpc' && 
    node.data?.type !== 'vpc' && 
    node.type !== 'vpcGroup'
  );

  for (const node of otherNodes) {
    const resourceData = node.data as any;
    const resourceName = resourceData.label.toLowerCase().replace(/[^a-z0-9]/g, '_');
    const config = resourceData.config || {};
    
    const matchedType = findBestMatch(resourceData.terraformType);
    if (matchedType) {
      // Prepare data for template
      let templateData: any = {
        name: resourceName,
        ...config
      };

      // Add default values for required fields if not present
      const requiredFields = knowledgeBase[matchedType].requiredFields;
      for (const field of requiredFields) {
        if (templateData[field] === undefined) {
          switch (field) {
            case 'ami':
              templateData[field] = 'ami-0c55b159cbfafe1f0';
              break;
            case 'instance_type':
              templateData[field] = 't3.micro';
              break;
            case 'engine':
              templateData[field] = 'postgres';
              break;
            case 'instance_class':
              templateData[field] = 'db.t3.micro';
              break;
            case 'username':
              templateData[field] = 'admin';
              break;
            case 'password':
              templateData[field] = 'CHANGEME';
              break;
            case 'allocated_storage':
              templateData[field] = 20;
              break;
            case 'bucket':
              templateData[field] = `${resourceName}-bucket-${Date.now()}`;
              break;
            case 'identifier':
              templateData[field] = resourceName;
              break;
            case 'db_name':
              templateData[field] = 'mydb';
              break;
            default:
              templateData[field] = '';
          }
        }
      }

      // Add VPC dependencies if applicable
      if (node.parentNode) {
        const parentVpc = nodes.find(n => n.id === node.parentNode);
        if (parentVpc) {
          const parentResourceName = parentVpc.data?.label.toLowerCase().replace(/[^a-z0-9]/g, '_');
          if (matchedType === 'aws_instance') {
            templateData.vpc_security_group_ids = `aws_security_group.${parentResourceName}_sg.id`;
            templateData.subnet_id = `aws_subnet.${parentResourceName}_subnet.id`;
          } else if (matchedType === 'aws_db_instance') {
            templateData.vpc_security_group_ids = `aws_security_group.${parentResourceName}_sg.id`;
          }
        }
      }

      const resourceCode = renderTemplate(knowledgeBase[matchedType].terraformTemplate, templateData);
      terraformCode += resourceCode + '\n\n';
    } else {
      // Fallback for unknown resource types
      terraformCode += `# Resource: ${resourceData.label}
# Type: ${resourceData.terraformType || resourceData.type}
# Configuration: ${JSON.stringify(config, null, 2)}
# TODO: Add proper Terraform configuration

`;
    }
  }

  return terraformCode;
};

/**
 * Simulates calling an LLM for more advanced Terraform generation
 * In a real implementation, this would call an actual LLM API
 */
export const generateTerraformWithLLM = async (
  nodes: Node[],
  llmEndpoint?: string,
  llmApiKey?: string
): Promise<string> => {
  // In a real implementation, this would:
  // 1. Convert nodes to a structured format
  // 2. Call an LLM API with the structured data and context
  // 3. Process the LLM response to generate Terraform
  
  // For now, we'll use the RAG approach as the foundation
  // but in a real implementation, this would be replaced with actual LLM call
  return await generateTerraformWithRag(nodes);
};

/**
 * Gets relevant examples from the knowledge base for a given resource type
 */
export const getTerraformExamples = (resourceType: string): string[] => {
  const matchedType = findBestMatch(resourceType);
  if (matchedType && knowledgeBase[matchedType]) {
    return knowledgeBase[matchedType].examples;
  }
  return [];
};

/**
 * Gets best practices for a given resource type
 */
export const getBestPractices = (resourceType: string): string[] => {
  const matchedType = findBestMatch(resourceType);
  if (matchedType && knowledgeBase[matchedType]) {
    return knowledgeBase[matchedType].bestPractices;
  }
  return [];
};