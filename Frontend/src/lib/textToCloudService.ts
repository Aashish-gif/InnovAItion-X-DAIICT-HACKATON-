import { Node } from 'reactflow';
import { generateTerraformWithRag } from './ragTerraformGenerator';

interface TextToCloudResult {
  nodes: Node[];
  edges: any[];
  terraformCode: string;
  success: boolean;
  message?: string;
}

// Mock implementation for demonstration purposes
// In a real implementation, this would call an actual AI API
export const convertTextToCloud = async (text: string): Promise<TextToCloudResult> => {
  try {
    // This is a simplified mock implementation
    // In a real scenario, you would call an AI API like OpenAI
    
    // Parse the text to identify infrastructure components
    const textLower = text.toLowerCase();
    const nodes: Node[] = [];
    
    // Define positions for nodes
    const positions = [
      { x: Math.random() * 300 + 100, y: Math.random() * 200 + 100 },
      { x: Math.random() * 300 + 100, y: Math.random() * 200 + 100 },
      { x: Math.random() * 300 + 100, y: Math.random() * 200 + 100 },
      { x: Math.random() * 300 + 100, y: Math.random() * 200 + 100 },
      { x: Math.random() * 300 + 100, y: Math.random() * 200 + 100 },
    ];
    
    let positionIndex = 0;
    
    // Identify common AWS services in the text
    if (textLower.includes('web server') || textLower.includes('ec2') || textLower.includes('instance')) {
      nodes.push({
        id: `node_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`, // Ensure unique ID
        type: 'cloudComponent',
        position: positions[positionIndex++ % positions.length],
        data: {
          label: 'Web Server',
          resourceType: 'Virtual Server',
          icon: 'Server',
          terraformType: 'aws_instance',
          category: 'compute',
          type: 'ec2',
          config: {
            ami: 'ami-0c55b159cbfafe1f0',
            instance_type: 't3.micro',
            key_name: '',
            vpc_security_group_ids: [],
            subnet_id: '',
          }
        },
      });
    }
    
    if (textLower.includes('s3') || textLower.includes('bucket') || textLower.includes('images')) {
      nodes.push({
        id: `node_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`, // Ensure unique ID
        type: 'cloudComponent',
        position: positions[positionIndex++ % positions.length],
        data: {
          label: 'Image Storage',
          resourceType: 'Object Storage',
          icon: 'Folder',
          terraformType: 'aws_s3_bucket',
          category: 'storage',
          type: 's3',
          config: {
            bucket: 'image-storage-' + Date.now(),
            acl: 'private',
            versioning: { enabled: true },
          }
        },
      });
    }
    
    if (textLower.includes('database') || textLower.includes('rds') || textLower.includes('mysql') || textLower.includes('postgres')) {
      nodes.push({
        id: `node_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`, // Ensure unique ID
        type: 'cloudComponent',
        position: positions[positionIndex++ % positions.length],
        data: {
          label: 'Database',
          resourceType: 'Relational Database',
          icon: 'Database',
          terraformType: 'aws_db_instance',
          category: 'database',
          type: 'rds',
          config: {
            engine: 'postgres',
            engine_version: '15.4',
            instance_class: 'db.t3.micro',
            allocated_storage: 20,
            max_allocated_storage: 100,
            storage_type: 'gp2',
            db_name: 'mydb',
            username: 'admin',
            password: '',
            skip_final_snapshot: true,
          }
        },
      });
    }
    
    if (textLower.includes('load balancer') || textLower.includes('elb') || textLower.includes('alb')) {
      nodes.push({
        id: `node_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`, // Ensure unique ID
        type: 'cloudComponent',
        position: positions[positionIndex++ % positions.length],
        data: {
          label: 'Load Balancer',
          resourceType: 'Elastic Load Balancer',
          icon: 'Scale',
          terraformType: 'aws_lb',
          category: 'network',
          type: 'elb',
          config: {
            name: 'web-lb',
            internal: false,
            load_balancer_type: 'application',
          }
        },
      });
    }
    
    if (textLower.includes('vpc') || textLower.includes('network') || textLower.includes('secure')) {
      nodes.push({
        id: `node_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`, // Ensure unique ID
        type: 'vpcGroup',
        position: { x: Math.random() * 200 + 50, y: Math.random() * 200 + 50 },
        data: {
          label: 'Secure VPC',
          resourceType: 'Virtual Private Cloud',
          icon: 'Network',
          terraformType: 'aws_vpc',
          category: 'network',
          type: 'vpc',
          config: {
            cidr_block: '10.0.0.0/16',
            enable_dns_hostnames: true,
            enable_dns_support: true,
          }
        },
      });
    }
    
    if (textLower.includes('security') || textLower.includes('firewall') || textLower.includes('sg')) {
      nodes.push({
        id: `node_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`, // Ensure unique ID
        type: 'cloudComponent',
        position: positions[positionIndex++ % positions.length],
        data: {
          label: 'Security Group',
          resourceType: 'Firewall Rules',
          icon: 'Shield',
          terraformType: 'aws_security_group',
          category: 'security',
          type: 'sg',
          config: {
            name: 'web-sg',
            description: 'Security group for web server',
          }
        },
      });
    }
    
    // If no nodes were identified, create a default VPC
    if (nodes.length === 0) {
      nodes.push({
        id: `node_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`, // Ensure unique ID
        type: 'cloudComponent',
        position: { x: Math.random() * 200 + 100, y: Math.random() * 100 + 50 },
        data: {
          label: 'Default Server',
          resourceType: 'Virtual Server',
          icon: 'Server',
          terraformType: 'aws_instance',
          category: 'compute',
          type: 'ec2',
          config: {
            ami: 'ami-0c55b159cbfafe1f0',
            instance_type: 't3.micro',
          }
        },
      });
    }
    
    // Generate Terraform code from the nodes using RAG
    const terraformCode = await generateTerraformWithRag(nodes, []); // No edges for text-to-cloud conversion
    
    return {
      nodes,
      edges: [],
      terraformCode,
      success: true,
      message: `Generated ${nodes.length} infrastructure components from your description`
    };
  } catch (error) {
    console.error('Error in text-to-cloud conversion:', error);
    return {
      nodes: [],
      edges: [],
      terraformCode: '',
      success: false,
      message: 'Failed to convert text to cloud infrastructure. Please try again.'
    };
  }
};

// Real implementation would call an AI API
export const convertTextToCloudWithAI = async (text: string, apiKey?: string): Promise<TextToCloudResult> => {
  // This is where you would integrate with an actual AI service like OpenAI
  // For now, using the mock implementation
  return convertTextToCloud(text);
};