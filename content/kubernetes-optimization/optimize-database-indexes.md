---
title: "Optimize Database Indexes"
description: "Rules and best practices for optimizing database queries and indexes"
weight: 8
tags:
- database
- index
- sql
- query
---

# Reduce Indexes

Consider the cost of maintaining indexes. Pick the most important queries and set up indexes for those first

# Retrieve Less Data

Retrieve less data from the database. It will consume less bandwidth and will require less processing.

# Avoid Point Queries

Avoid point queries and point index lookup within range queries.

Random access is slow, sequential access is fast.

If possible, make indexes covering.

# Avoid Sorting and Grouping

Avoid sorting and grouping the result after query execution.

Indexes on the sorting and grouping fields can help get rid of this.

# Use Equality Check in Queries With Compound Indexes

Compound indexes on composite primary keys in many-to-many tables will only work for range queries if an equality check on the first column in the index is included in the query.

If the equality check on the first column in the index is not included in the query, the indexes are useless and only consume disk space and slow down writes.

# Compound Indexes Rules

When creating compound indexes, follow these rules for queries combining equality tests, sort fields, and range filters:

* Add fields in order from the highest selectivity to the lowest selectivity (if a field is not selective enough, do not add it to the index)
* Equality tests - add all equality-tested fields to the compound index, in any order
* Sort fields (ascending/descending only matters if there are multiple fields) - add sort fields to the index in the same order and direction as the query's sort
* Range filters - first, add the range filter for the field with the lowest selectivity (fewest distinct values in the collection), then the next lowest-selectivity range filter, and so on to the highest-selectivity
(this is counter-intuitive at first, but it allows the database to more effectively traverse different parts of B-Trees)
