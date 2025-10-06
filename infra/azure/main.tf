terraform {
  required_providers {
    azurerm = { source = "hashicorp/azurerm", version = "~> 3.0" }
  }
}

provider "azurerm" {
  features {}
}

# Day-1 minimal: subscription data to confirm provider loads
data "azurerm_subscription" "current" {}

output "subscription_id" { value = data.azurerm_subscription.current.subscription_id }
