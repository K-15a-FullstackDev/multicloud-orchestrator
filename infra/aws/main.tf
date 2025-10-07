provider "aws" {
  region = var.aws_region
}

resource "aws_instance" "web" {
  ami           = "ami-0c02fb55956c7d316" # Amazon Linux 2
  instance_type = "t2.micro"
  tags = {
    Name = "${var.project}-ec2"
  }
  user_data = <<EOF
#!/bin/bash
yum install -y nginx
systemctl enable nginx
systemctl start nginx
EOF
}

resource "aws_s3_bucket" "static" {
  bucket = "${var.project}-static-bucket"
}

output "instance_public_ip" {
  value = aws_instance.web.public_ip
}
