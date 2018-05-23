module "assets_bucket_label" {
  source    = "git::https://github.com/cloudposse/terraform-null-label.git?ref=tags/0.3.3"
  namespace = "eg"
  stage     = "example"
  name      = "assets"
}

resource "aws_s3_bucket" "assets" {
  bucket        = "${module.assets_bucket_label.id}"
  acl           = "private"
  region        = "us-west-2"
  force_destroy = false

  versioning {
    enabled = true
  }

  server_side_encryption_configuration {
    rule {
      apply_server_side_encryption_by_default {
        sse_algorithm = "AES256"
      }
    }
  }

  tags = "${module.assets_bucket_label.tags}"
}
