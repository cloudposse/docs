---
title: aurora-postgres-resources
sidebar_label: aurora-postgres-resources
sidebar_class_name: command
custom_edit_url: https://github.com/cloudposse/terraform-aws-components/blob/main/modules/aurora-postgres-resources/README.md
tags: [terraform, aws, aurora-postgres-resources]
---

# Component: `aurora-postgres-resources`

This component is responsible for provisioning Aurora Postgres resources: additional databases, users, permissions,
grants, etc.

## Usage

**Stack Level**: Regional

Here's an example snippet for how to use this component.

```yaml
components:
  terraform:
    aurora-postgres-resources:
      vars:
        aurora_postgres_component_name: aurora-postgres-example
        additional_users:
          example:
            db_user: example
            db_password: ""
            grants:
              - grant: ["ALL"]
                db: example
                object_type: database
                schema: ""
```

## PostgreSQL Quick Reference on Grants

GRANTS can be on database, schema, role, table, and other database objects (e.g. columns in a table for fine control).
Database and schema do not have much to grant. The `object_type` field in the input determines which kind of object the
grant is being applied to. The `db` field is always required. The `schema` field is required unless the `object_type` is
`db`, in which case it should be set to the empty string (`""`).

The keyword PUBLIC indicates that the privileges are to be granted to all roles, including those that might be created
later. PUBLIC can be thought of as an implicitly defined group that always includes all roles. Any particular role will
have the sum of privileges granted directly to it, privileges granted to any role it is presently a member of, and
privileges granted to PUBLIC.

When an object is created, it is assigned an owner. The owner is normally the role that executed the creation statement.
For most kinds of objects, the initial state is that only the owner (or a superuser) can do anything with the object. To
allow other roles to use it, privileges must be granted. (When using AWS managed RDS, you cannot have access to any
superuser roles; superuser is reserved for AWS to use to manage the cluster.)

PostgreSQL grants privileges on some types of objects to PUBLIC by default when the objects are created. No privileges
are granted to PUBLIC by default on tables, table columns, sequences, foreign data wrappers, foreign servers, large
objects, schemas, or tablespaces. For other types of objects, the default privileges granted to PUBLIC are as follows:
CONNECT and TEMPORARY (create temporary tables) privileges for databases; EXECUTE privilege for functions and
procedures; and USAGE privilege for languages and data types (including domains). The object owner can, of course,
REVOKE both default and expressly granted privileges. (For maximum security, issue the REVOKE in the same transaction
that creates the object; then there is no window in which another user can use the object.) Also, these default
privilege settings can be overridden using the ALTER DEFAULT PRIVILEGES command.

The CREATE privilege:

- For databases, allows new schemas and publications to be created within the database, and allows trusted extensions to
  be installed within the database.
- For schemas, allows new objects to be created within the schema. To rename an existing object, you must own the object
  and have this privilege for the containing schema.

For databases and schemas, there are not a lot of other privileges to grant, and all but CREATE are granted by default,
so you might as well grant "ALL". For tables etc., the creator has full control. You grant access to other users via
explicit grants. This component does not allow fine-grained grants. You have to specify the database, and unless the
grant is on the database, you have to specify the schema. For any other object type (table, sequence, function,
procedure, routine, foreign_data_wrapper, foreign_server, column), the component applies the grants to all objects of
that type in the specified schema.

<!-- prettier-ignore-start -->
<!-- BEGINNING OF PRE-COMMIT-TERRAFORM DOCS HOOK -->
<!-- hello terraform-docs -->
<!-- END OF PRE-COMMIT-TERRAFORM DOCS HOOK -->
<!-- prettier-ignore-end -->

## References

- [cloudposse/terraform-aws-components](https://github.com/cloudposse/terraform-aws-components/tree/main/modules/aurora-postgres-resources) -
  Cloud Posse's upstream component

- PostgreSQL references (select the correct version of PostgreSQL at the top of the page):
  - [GRANT command](https://www.postgresql.org/docs/14/sql-grant.html)
  - [Privileges that can be GRANTed](https://www.postgresql.org/docs/14/ddl-priv.html)



