{
  "name": "College",
  "type": "object",
  "properties": {
    "name": {
      "type": "string"
    },
    "code": {
      "type": "string",
      "description": "Unique college code"
    },
    "description": {
      "type": "string"
    },
    "logo_url": {
      "type": "string"
    },
    "cover_image_url": {
      "type": "string"
    },
    "city": {
      "type": "string"
    },
    "state": {
      "type": "string",
      "default": "Tamil Nadu"
    },
    "address": {
      "type": "string"
    },
    "website": {
      "type": "string"
    },
    "phone": {
      "type": "string"
    },
    "email": {
      "type": "string"
    },
    "courses": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "description": "Available courses like BTech CS, BTech Mechanical"
    },
    "application_fee": {
      "type": "number"
    },
    "annual_fees_min": {
      "type": "number"
    },
    "annual_fees_max": {
      "type": "number"
    },
    "has_hostel": {
      "type": "boolean",
      "default": false
    },
    "hostel_fees": {
      "type": "number"
    },
    "has_scholarship": {
      "type": "boolean",
      "default": false
    },
    "scholarship_details": {
      "type": "string"
    },
    "accreditation": {
      "type": "string",
      "enum": [
        "NAAC A++",
        "NAAC A+",
        "NAAC A",
        "NAAC B++",
        "NAAC B+",
        "NAAC B",
        "Not Accredited"
      ]
    },
    "ranking": {
      "type": "number",
      "description": "NIRF ranking if available"
    },
    "application_deadline": {
      "type": "string",
      "format": "date"
    },
    "is_active": {
      "type": "boolean",
      "default": true
    },
    "custom_questions": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "question": {
            "type": "string"
          },
          "type": {
            "type": "string",
            "enum": [
              "text",
              "select",
              "checkbox"
            ]
          },
          "options": {
            "type": "array",
            "items": {
              "type": "string"
            }
          },
          "required": {
            "type": "boolean"
          }
        }
      }
    },
    "admin_email": {
      "type": "string",
      "description": "College admin email for management"
    }
  },
  "required": [
    "name",
    "code",
    "city"
  ]
}
