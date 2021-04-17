module "staging_cloudfront" {
  source = "../../../modules/terraform-aws-cloudfront"

  aliases = ["stag.topdup.org"]

  comment             = "Topdup webapp"
  enabled             = true
  is_ipv6_enabled     = true
  price_class         = "PriceClass_All"
  retain_on_delete    = false
  wait_for_deployment = false

  create_origin_access_identity = true
  origin_access_identities = {
    s3_bucket_one = "topdup-staging-frontend"
  }

  viewer_certificate = {
    acm_certificate_arn = "arn:aws:acm:us-east-1:221423461835:certificate/42d3d0fa-f73e-424a-b975-d9cffdaab871"
    ssl_support_method  = "sni-only"
  }

  origin = {
    topdup-s3-frontend = {
      domain_name = "topdup-staging-frontend.s3.amazonaws.com"
      s3_origin_config = {
        origin_access_identity = "s3_bucket_one"
      }
    }
  }

  default_cache_behavior = {
    target_origin_id       = "topdup-s3-frontend"
    viewer_protocol_policy = "redirect-to-https"

    allowed_methods = ["GET", "HEAD", "OPTIONS"]
    cached_methods  = ["GET", "HEAD"]
    compress        = true
    query_string    = true
  }
  custom_error_response = [
    {
      error_code = "403"  
      response_page_path = "/index.html"
      response_code = "403"
    },
    {
      error_code = "404"  
      response_page_path = "/index.html"
      response_code = "404"
    }  
  ]
}
