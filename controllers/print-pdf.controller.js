const puppeteer = require('puppeteer');
const asyncHandler = require('express-async-handler')

const printPdf = asyncHandler(async (req, res) => {

    let { jobDescription, skills, tasks } = req.body

    if (!jobDescription || !Array.isArray(skills) || !Array.isArray(tasks)) {
        return res.status(400).send('Bad request');
    }

    /* jobDescription = jobDescription.replace(/ /g, " ")
    jobDescription = jobDescription.replace(/\n/g, "\n") */

    const browser = await puppeteer.launch({
        headless: 'new',
    });

    const page = await browser.newPage()

    let skillsHtml = '<h2 style="color: #7CA5E0">Skills</h2><ul>';
    for (let skill of skills) {
        skillsHtml += `<li>${skill.skillItem} - ${skill.skillCategory}</li>`;
    }
    skillsHtml += '</ul>';

    let tasksHtml = '<h2 style="color: #7CA5E0">Tasks</h2><ul>';
    for (let task of tasks) {
        tasksHtml += `<li>${task.taskMinorCategory} - ${task.taskMajorCategory}</li>`;
    }
    tasksHtml += '</ul>';
    // This is where you'll create your HTML layout. For simplicity,
    // let's assume you'll just put the jobDescription in the PDF.
    await page.setContent(` <style>
  body {
      display: flex;
      justify-content: center;
      align-items: flex-start;  /* Align items to the top of the page */
      height: 100vh;
      margin: 20px;
      font-family: Arial, sans-serif;
  }
</style>

    <body>
        <div>
            <div>
                <h2 style="text-align: center; color: #7CA5E0; margin-bottom: 50px">Generated Job Description</h2> 
            </div>
            <pre  style="text-align: justify; line-height: 32px; font-family: Arial, sans-serif; margin-bottom: 50px" >${jobDescription}</pre>
              ${skillsHtml}
            ${tasksHtml}
        </div>
    </body>`)

    const pdf = await page.pdf({ format: 'A4' })

    await browser.close()

    res.set({
        'Content-Type': 'application/pdf',
        'Content-Length': pdf.length,
        'Content-Disposition': 'attachment; filename="Job Description.pdf"',
    });
    res.send(pdf);
})

module.exports = {
    printPdf
}