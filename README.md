# ANL Intercab Performance API Tests

Performance test suite for Intercab APIs using Apache JMeter.

## Overview

This workspace contains:

- Main test plan: IntercabTest Plan .jmx
- Generated reports: HTML_Report
- Additional artifacts: FinalReports

The test flow covers key API domains such as costing, product, pricing, and commercial agreement scenarios.

## Prerequisites

- Java 11 or newer
- Apache JMeter 5.6.2 or compatible
- Network access to stage API endpoints
- Valid authentication and test data for Intercab services

## Project Structure

- IntercabTest Plan .jmx: Main JMeter test plan
- HTML_Report: Dashboard-style HTML reports
- FinalReports: Aggregated or exported run outputs

## Quick Start

1. Open JMeter.
2. Load IntercabTest Plan .jmx.
3. Review thread group settings and test data variables.
4. Run tests from GUI or CLI.

### CLI Execution Example

```bash
jmeter -n -t "IntercabTest Plan .jmx" -l "FinalReports/results.jtl" -e -o "HTML_Report/latest"
```

## Key Notes

- The test plan includes multiple enabled/disabled samplers for different use cases.
- Some requests generate dynamic IDs and dates through JSR223 scripts.
- Corporate group data is assigned per thread to support parallel execution.
- Ensure endpoint availability before running larger loads.

## Reports

After execution:

- JTL results are stored in your selected output path.
- HTML dashboard is available in HTML_Report, for example:
  - HTML_Report/04June26/index.html
  - HTML_Report/04junev2/index.html

## Troubleshooting

- Empty or failed extracts: verify JSONPath extractors and response payloads.
- Unexpected 4xx/5xx: validate auth, payload shape, and required IDs.
- Duplicate data conflicts: check random/unique-name generators in JSR223 scripts.
- Date-related failures: verify timezone and validity window fields.

## Maintenance Tips

- Keep disabled samplers organized by scenario.
- Standardize variable names for IDs and timestamps.
- Separate smoke, regression, and load profiles into dedicated thread groups if possible.
- Archive run artifacts by date for trend comparison.

## Author

Performance Engineering Team - Intercab API Testing
