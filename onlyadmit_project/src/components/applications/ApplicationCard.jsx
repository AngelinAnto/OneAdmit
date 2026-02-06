{
  "name": "Application",
  "type": "object",
  "properties": {
    "student_profile_id": {
      "type": "string"
    },
    "student_email": {
      "type": "string"
    },
    "student_name": {
      "type": "string"
    },
    "college_id": {
      "type": "string"
    },
    "college_name": {
      "type": "string"
    },
    "course": {
      "type": "string"
    },
    "status": {
      "type": "string",
      "enum": [
        "pending",
        "submitted",
        "under_review",
        "accepted",
        "rejected",
        "waitlisted"
      ],
      "default": "pending"
    },
    "exam_slot_id": {
      "type": "string"
    },
    "exam_date": {
      "type": "string",
      "format": "date"
    },
    "exam_time": {
      "type": "string"
    },
    "result_date": {
      "type": "string",
      "format": "date",
      "description": "Tentative result release date"
    },
    "payment_status": {
      "type": "string",
      "enum": [
        "pending",
        "completed",
        "failed",
        "refunded"
      ],
      "default": "pending"
    },
    "payment_id": {
      "type": "string"
    },
    "amount_paid": {
      "type": "number"
    },
    "needs_hostel": {
      "type": "boolean",
      "default": false
    },
    "needs_scholarship": {
      "type": "boolean",
      "default": false
    },
    "custom_answers": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "question": {
            "type": "string"
          },
          "answer": {
            "type": "string"
          }
        }
      }
    },
    "notes": {
      "type": "string"
    }
  },
  "required": [
    "student_profile_id",
    "college_id",
    "course"
  ]
}
