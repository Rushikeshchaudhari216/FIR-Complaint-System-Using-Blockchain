from fpdf import FPDF

class Resume(FPDF):
    def header(self):
        self.set_font("Arial", "B", 16)
        self.cell(0, 10, "Rushikesh Sadashiv Chaudhari", ln=True, align="C")
        self.set_font("Arial", "", 12)
        self.cell(0, 10, "Email: mr.rushi216@gmail.com | Phone: +91-8390004170", ln=True, align="C")
        self.ln(10)

    def section_title(self, title):
        self.set_font("Arial", "B", 14)
        self.set_text_color(0, 0, 128)
        self.cell(0, 10, title, ln=True)
        self.set_text_color(0, 0, 0)

    def section_body(self, content):
        self.set_font("Arial", "", 12)
        self.multi_cell(0, 8, content)
        self.ln(3)

    def add_certificate(self, title, link):
        self.set_font("Arial", "", 12)
        self.set_text_color(0, 0, 255)
        self.cell(0, 10, f"{title}: {link}", ln=True, link=link)
        self.set_text_color(0, 0, 0)

# Create PDF
pdf = Resume()
pdf.add_page()

# Summary
pdf.section_title("Professional Summary")
pdf.section_body("Computer Engineering student with a strong foundation in Python, web development, and AWS. Quick learner and team player with a passion for problem-solving and clean code.")

# Skills
pdf.section_title("Skills")
pdf.section_body("• Python • Flask • HTML/CSS/JavaScript • Git & GitHub • AWS (EC2, Lambda, Beanstalk, S3)\n• MySQL • REST APIs • Object-Oriented Programming")

# Education
pdf.section_title("Education")
pdf.section_body("B.Tech in Computer Engineering\nYour College Name, 2021 – 2025\nCGPA: 8.7/10 (or your actual CGPA)")

# Projects
pdf.section_title("Projects")
pdf.section_body(
    "• Resume Builder in Python – Created a professional resume generator with clickable certificate links using fpdf.\n"
    "• AWS Deployment Project – Built and deployed a Python web app using Elastic Beanstalk and RDS.\n"
    "• To-Do List App – Developed using Flask and Bootstrap with CRUD operations."
)

# Certifications
pdf.section_title("Certifications")
pdf.add_certificate("AWS Cloud Practitioner", "https://www.credly.com/badges/example-aws-cert-link")
pdf.add_certificate("Python for Everybody – Coursera", "https://coursera.org/verify/example-python-cert")

# Save PDF
pdf.output("Rushikesh_Chaudhari_Resume.pdf")

print("Resume created successfully!")