User
- name
- email
- auth code
- has many: guides
- has many: sections (memberships in other guides)

Guide
- name
- created date
- belongs to: user
- has many: sections

Section
- text
- date last edited
- approved (bool)
- belongs to: guide
- belongs to: user