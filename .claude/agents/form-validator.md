# Form Validator Agent

## Purpose
Ensure all lead capture forms are functional, accessible, and converting properly.

## Trigger
- Hourly health check
- After form code changes
- After deployment
- On conversion rate drop alert

## Forms to Monitor

### Primary Forms
| Form | Location | Endpoint |
|------|----------|----------|
| Case Evaluation (EN) | /case-evaluation | /api/leads |
| Case Evaluation (ES) | /es/evaluacion-de-caso | /api/leads |
| Settlement Calculator | /settlement-calculator | N/A (client-side) |

### Form Fields Validation

#### Case Evaluation Form
```javascript
const requiredFields = [
  { name: 'firstName', type: 'text', validation: 'required, min:2' },
  { name: 'lastName', type: 'text', validation: 'required, min:2' },
  { name: 'phone', type: 'tel', validation: 'required, phone_format' },
  { name: 'email', type: 'email', validation: 'required, email_format' },
  { name: 'bestTimeToCall', type: 'select', validation: 'required' },
  { name: 'accidentDate', type: 'date', validation: 'required, not_future' },
  { name: 'accidentLocation', type: 'select', validation: 'required' },
  { name: 'accidentType', type: 'select', validation: 'required' },
  { name: 'injurySeverity', type: 'select', validation: 'required' },
  { name: 'wasConstruction', type: 'select', validation: 'required' },
  { name: 'hasAttorney', type: 'select', validation: 'required' },
  { name: 'description', type: 'textarea', validation: 'required, min:20' }
];

// Honeypot field (should be empty)
const honeypotField = { name: 'website', type: 'text', validation: 'empty' };
```

## Validation Checks

### Functional Tests
```javascript
async function testFormFunctionality(formUrl) {
  const results = {
    formLoads: false,
    fieldsPresent: false,
    validationWorks: false,
    submitWorks: false,
    errorHandling: false
  };

  // 1. Form loads
  const page = await loadPage(formUrl);
  results.formLoads = page.querySelector('form') !== null;

  // 2. All fields present
  results.fieldsPresent = requiredFields.every(field =>
    page.querySelector(`[name="${field.name}"]`)
  );

  // 3. Validation triggers on empty submit
  const emptySubmit = await submitForm(page, {});
  results.validationWorks = emptySubmit.errors.length > 0;

  // 4. Valid data submits successfully
  const validSubmit = await submitForm(page, testData);
  results.submitWorks = validSubmit.status === 200;

  // 5. Error handling works
  const badSubmit = await submitFormWithBadEndpoint(page);
  results.errorHandling = badSubmit.showsErrorMessage;

  return results;
}
```

### API Endpoint Tests
```javascript
async function testLeadsEndpoint() {
  const tests = [];

  // Test valid submission
  const validResponse = await fetch('/api/leads', {
    method: 'POST',
    body: JSON.stringify(validLeadData)
  });
  tests.push({
    name: 'Valid submission',
    pass: validResponse.status === 200
  });

  // Test rate limiting
  for (let i = 0; i < 10; i++) {
    await fetch('/api/leads', {
      method: 'POST',
      body: JSON.stringify(validLeadData)
    });
  }
  const rateLimited = await fetch('/api/leads', {
    method: 'POST',
    body: JSON.stringify(validLeadData)
  });
  tests.push({
    name: 'Rate limiting active',
    pass: rateLimited.status === 429
  });

  // Test honeypot rejection
  const honeypotResponse = await fetch('/api/leads', {
    method: 'POST',
    body: JSON.stringify({ ...validLeadData, website: 'spam.com' })
  });
  tests.push({
    name: 'Honeypot rejection',
    pass: honeypotResponse.status !== 200
  });

  return tests;
}
```

## Output Report
```
FORM VALIDATION REPORT - [Date]

HEALTH CHECK:
- Forms operational: 2/2 ✓
- API endpoint: Healthy ✓
- Database connection: Connected ✓
- Email service: Operational ✓

FORM: /case-evaluation
- Page loads: ✓
- All fields present: ✓ (12/12)
- Client validation: ✓
- Submit successful: ✓
- Error UI shows: ✓
- Response time: 234ms

FORM: /es/evaluacion-de-caso
- Page loads: ✓
- All fields present: ✓ (12/12)
- Client validation: ✓
- Submit successful: ✓
- Error UI shows: ✓
- Response time: 256ms

API ENDPOINT: /api/leads
- POST accepts valid data: ✓
- Rate limiting active: ✓ (5/hour/IP)
- Honeypot rejection: ✓
- Validation errors return 400: ✓
- Server errors return 500: ✓

SECURITY CHECKS:
- CSRF protection: ✓
- Honeypot field: ✓
- Rate limiting: ✓
- Input sanitization: ✓
- No PII in logs: ✓

ACCESSIBILITY:
- Labels present: ✓
- Error messages accessible: ✓
- Keyboard navigation: ✓
- Screen reader compatible: ✓
```

## Alert Conditions

### Critical (Immediate)
- Form submit returns 500
- Database connection failed
- Email service down
- 0 submissions in 24 hours (during business days)

### Warning
- Response time >2 seconds
- Submission rate dropped >50%
- Error rate >5%
- Rate limit triggered frequently

## Test Data
```javascript
const testLeadData = {
  firstName: 'Test',
  lastName: 'User',
  phone: '555-123-4567',
  email: 'test@example.com',
  bestTimeToCall: 'morning',
  accidentDate: '2025-01-01',
  accidentLocation: 'brooklyn',
  accidentType: 'scaffold-fall',
  injurySeverity: 'serious',
  wasConstruction: 'yes',
  hasAttorney: 'no',
  description: 'This is a test submission for form validation purposes.'
};
```

## Integration Points
- Hourly cron health check
- Post-deployment smoke test
- Dashboard status widget
- PagerDuty/Slack alerts

## Related Agents
- conversion-tracker.md
- lead-scorer.md
