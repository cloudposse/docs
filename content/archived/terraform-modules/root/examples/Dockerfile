FROM cloudposse/terraform-root-modules:0.1.5 as terraform-root-modules

FROM cloudposse/geodesic:0.9.16

# ...

# Copy root modules
COPY --from=terraform-root-modules /aws/tfstate-backend/ /conf/tfstate-backend/
COPY --from=terraform-root-modules /aws/chamber/ /conf/chamber/
COPY --from=terraform-root-modules /aws/cloudtrail/ /conf/cloudtrail/
