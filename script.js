const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');
const navigationItems = document.querySelectorAll('.nav-links a');
const revealItems = document.querySelectorAll('.reveal');
const sections = document.querySelectorAll('main section[id]');

menuToggle.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(isOpen));
  menuToggle.setAttribute('aria-label', isOpen ? 'Close navigation menu' : 'Open navigation menu');
});

navigationItems.forEach((item) => {
  item.addEventListener('click', () => {
    navLinks.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Open navigation menu');
  });
});

const revealObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

revealItems.forEach((item) => revealObserver.observe(item));

const activeSectionObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    navigationItems.forEach((item) => {
      item.classList.toggle('active', item.getAttribute('href') === `#${entry.target.id}`);
    });
  });
}, { rootMargin: '-35% 0px -60% 0px' });

sections.forEach((section) => activeSectionObserver.observe(section));

const resumeSource = document.querySelector('[data-resume-frame]');
const resumePreview = document.querySelector('[data-resume-preview]');
const resumePreviewPaper = document.querySelector('[data-resume-preview-paper]');
const previewResumeButton = document.querySelector('[data-preview-resume]');
const closeResumeButton = document.querySelector('[data-close-resume]');
const printResumeButtons = document.querySelectorAll('[data-print-resume]');
const downloadResumeButton = document.querySelector('[data-download-resume]');

const openResumePreview = () => {
  const previewFrame = resumeSource.cloneNode(true);
  previewFrame.classList.add('resume-preview-frame');
  resumePreviewPaper.replaceChildren(previewFrame);
  resumePreview.classList.add('is-open');
  resumePreview.setAttribute('aria-hidden', 'false');
  document.body.classList.add('resume-preview-open');
  closeResumeButton.focus();
};

const closeResumePreview = () => {
  resumePreview.classList.remove('is-open');
  resumePreview.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('resume-preview-open');
  previewResumeButton.focus();
};

previewResumeButton.addEventListener('click', openResumePreview);
closeResumeButton.addEventListener('click', closeResumePreview);
resumePreview.addEventListener('click', (event) => {
  if (event.target === resumePreview) closeResumePreview();
});
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && resumePreview.classList.contains('is-open')) closeResumePreview();
});
printResumeButtons.forEach((button) => {
  button.addEventListener('click', () => window.print());
});

const addPdfSection = (document, x, y, width, title, content, options = {}) => {
  const titleSize = options.titleSize || 8;
  const bodySize = options.bodySize || 8.5;
  const lineHeight = options.lineHeight || 3.7;
  document.setFont('helvetica', 'bold');
  document.setFontSize(titleSize);
  document.setTextColor(161, 79, 110);
  document.text(title.toUpperCase(), x, y);
  y += 4;
  document.setFont('helvetica', 'normal');
  document.setFontSize(bodySize);
  document.setTextColor(42, 31, 36);
  const lines = document.splitTextToSize(content, width);
  document.text(lines, x, y, { lineHeightFactor: lineHeight / bodySize });
  return y + lines.length * lineHeight + (options.gap || 4);
};

const downloadResumePdf = () => {
  const { jsPDF } = window.jspdf || {};
  if (!jsPDF) {
    window.print();
    return;
  }

  const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4', compress: true });
  const left = 15;
  const right = 195;
  const divider = 88;
  let y = 18;

  pdf.setTextColor(42, 31, 36);
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(22);
  pdf.text('Trisha Mae Angel C. Sapeda', left, y);
  y += 7;
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(9.5);
  pdf.setTextColor(161, 79, 110);
  pdf.text('ON-THE-JOB TRAINEE  |  INFORMATION SYSTEMS', left, y);
  y += 5;
  pdf.setFontSize(8.5);
  pdf.setTextColor(42, 31, 36);
  pdf.text('+63 993 987 8369  |  sapedashamae@gmail.com  |  Batino, Calapan City, Oriental Mindoro', left, y);
  y += 5;
  pdf.setDrawColor(161, 79, 110);
  pdf.setLineWidth(0.7);
  pdf.line(left, y, right, y);
  y += 7;

  y = addPdfSection(pdf, left, y, 180, 'Professional summary', 'A motivated and responsible Information Systems student seeking an On-the-Job Training opportunity to gain practical experience, apply academic knowledge and skills, develop relevant competencies, and contribute positively to an organization.', { bodySize: 9, lineHeight: 4, gap: 5 });
  const columnsY = y;
  let leftY = columnsY;
  let rightY = columnsY;

  leftY = addPdfSection(pdf, left, leftY, 62, 'Education', 'City College of Calapan\nBachelor of Science in Information Systems | 2023 - Present\n\nManagpi National High School\nGeneral Academic Strand | 2021 - 2023\n\nBatino Elementary School\n2011 - 2017', { bodySize: 8.5, lineHeight: 3.8, gap: 5 });
  leftY = addPdfSection(pdf, left, leftY, 62, 'Technical skills', 'Database Management (MySQL)\nWeb Development (HTML, CSS, JavaScript)\nMicrosoft Office (Word, Excel, PowerPoint)', { bodySize: 8.5, lineHeight: 3.8, gap: 5 });
  leftY = addPdfSection(pdf, left, leftY, 62, 'Soft skills', 'Communication\nTeam Collaboration\nAttention to Detail\nAdaptability\nWillingness to Learn', { bodySize: 8.5, lineHeight: 3.8, gap: 5 });

  rightY = addPdfSection(pdf, divider, rightY, 107, 'Seminars and training', 'TESDA Computer System Servicing Training\nProgramming Java NC III (40 Days Training)\nSupervised Industry Training of Programming (Java) NC III at OLLOPA Corporation (120 hours)\nCalapan City, 2nd IT Summit\nDICT Seminar', { bodySize: 8.5, lineHeight: 3.8, gap: 5 });
  rightY = addPdfSection(pdf, divider, rightY, 107, 'Certifications', 'TESDA National Certificate of Training - Programming (Java) NC III\nTESDA National Certificate II - Computer Systems Servicing (CSS NC II)\nCertificate of Enterprise Training Completion - Supervised Industry Training of Programming (Java) NC III at OLLOPA Corporation\nMicrosoft Cybersecurity Course: Security, Compliance, and Identity Fundamentals', { bodySize: 8.5, lineHeight: 3.8, gap: 5 });
  rightY = addPdfSection(pdf, divider, rightY, 107, 'Relevant experience', 'Supervised Industry Training of Programming (Java) NC III at OLLOPA Corporation - 120 hours.', { bodySize: 8.5, lineHeight: 3.8, gap: 5 });
  addPdfSection(pdf, divider, rightY, 107, 'References', 'Mr. Hanzel B. Metrio - Engineer / Professor - +63 945 528 3221\nMr. Jeremiah C. Delizo - Professor - +63 930 000 5339', { bodySize: 8.5, lineHeight: 3.8, gap: 0 });

  pdf.save('Trisha_Mae_Angel_C_Sapeda_Resume.pdf');
};

