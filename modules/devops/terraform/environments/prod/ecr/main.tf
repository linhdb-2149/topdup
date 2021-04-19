module "topdup_ecr" { 
  source    = "../../../modules//terraform-aws-ecr"
  namespace = "topdup"
  stage     = "prod"
  name      = "ml"
  tags  = {
    Terraform   = "true"
    Owner       = "devops"
    Environment = "topdup-prod"
    Function    = "ml"
  }
}

module "topdup_ecr_backedn" { 
  source    = "../../../modules//terraform-aws-ecr"
  namespace = "topdup"
  stage     = "prod"
  name      = "backend"
  tags  = {
    Terraform   = "true"
    Owner       = "devops"
    Environment = "topdup-prod"
    Function    = "backend"
  }
}
