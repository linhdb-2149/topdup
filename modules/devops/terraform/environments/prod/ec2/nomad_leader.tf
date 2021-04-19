module "nomad_leader" {
  source = "../../../modules/terraform-aws-ec2-instance"

  name                   = "topdup-nomad_leader"
  instance_count         = 1
  ami                    = "ami-06fb5332e8e3e577a"
  instance_type          = "t3a.medium"
  key_name               = "topdup-prod"
  root_block_device = [
    {
      volume_size           = 20
      delete_on_termination = true
    }
  ]

  ebs_block_device = [
    {
      device_name = "/dev/sdf"
      volume_type = "gp2"
      volume_size = 30
    }
  ]

  user_data_base64 = base64encode(local.install_nomad_docker)

  disable_api_termination     = true
  vpc_security_group_ids      = tolist([module.prod_nomad_leader_secgroup.this_security_group_id])
  subnet_ids                 = data.terraform_remote_state.prod_vpc.outputs.prod_vpc_public_subnets

  tags = {
    Terraform   = "true"
    Environment = "topdup-prod"
    Function    = "nomad_leader"
  }
}

module "prod_nomad_leader_secgroup" {
  source  = "../../../modules/terraform-aws-security-group"

  name        = "nomad_leader_secgroup"
  description = "Security group for NomadLeader Ec2 instance"
  vpc_id      = data.terraform_remote_state.prod_vpc.outputs.prod_vpc_id

  ingress_cidr_blocks = ["0.0.0.0/0"]
  ingress_rules       = ["ssh-tcp", "all-icmp"]
  ingress_with_cidr_blocks = [
    {
      from_port   = 4648
      to_port     = 4648
      protocol    = "tcp"
      description = "Allow access to Nomad server"
      cidr_blocks = data.terraform_remote_state.prod_vpc.outputs.prod_vpc_cidr_block
    },
    {
      from_port   = 4647
      to_port     = 4647
      protocol    = "tcp"
      description = "Allow access to Nomad server"
      cidr_blocks = data.terraform_remote_state.prod_vpc.outputs.prod_vpc_cidr_block
    },
    {
      from_port   = 4646
      to_port     = 4646
      protocol    = "tcp"
      description = "Allow access to Nomad server"
      cidr_blocks = data.terraform_remote_state.prod_vpc.outputs.prod_vpc_cidr_block
    }
  ]

  egress_rules        = ["all-all"]
}
