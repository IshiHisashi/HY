# Pill Book

<p align=center>
  <img width="300" src=https://github.com/IshiHisashi/hy/blob/main/frontend/public/images/logo/logo2.png alt='Pillbook'/>
</p>

<p align=center>
 <p>Welcome to Pill book!</p>
  <p>This app is designed to help you manage your medications efficiently and ensure you never miss a dose. Whether you need to keep track of daily vitamins, prescription medications, or occasional over-the-counter drugs, our app provides a simple and intuitive way to stay on top of your medication schedule.</p>

## Features
<ul>
 <li><strong>Personalized Medication List</strong>: Add and manage your medications with ease. Input details such as medication name, dosage and frequency.</li>
 <li>
<strong>Shortage reminders</strong>: Users are to be reminded once remaining amount is less than the designated threshold.</li>
 <li>
<strong>Medication History</strong>: Keep a record of your medication intake. View your history to track adherence and share with healthcare providers if needed.</li>
  <li>
<strong>Dosage notifications</strong>: Set up reminders to take your medications at the right times. Receive push notifications to ensure you never forget a dose (this is currently Android users only).</li>
</ul>

## Demo


### Screenshots
<table>
  <thead>
    <th>Task list</th>
    <th>Take log</th>
    <th>Add medication</th>
    <th>Medication list</th>
    <th>Medication details</th>
     </thead>
  <tr>
    <td valign="top"><img src=https://github.com/IshiHisashi/hy/blob/main/frontend/public/images/screen/Task%20list.png width=150/></td>
    <td valign="top"><img src=https://github.com/IshiHisashi/hy/blob/main/frontend/public/images/screen/Take%20log.png width=150/></td>
    <td valign="top"><img src=https://github.com/IshiHisashi/hy/blob/main/frontend/public/images/screen/Add%20medication.png width=150/></td>
    <td valign="top"><img src=https://github.com/IshiHisashi/hy/blob/main/frontend/public/images/screen/Medication%20list.png width=150/></td>
    <td valign="top"><img src=https://github.com/IshiHisashi/hy/blob/main/frontend/public/images/screen/Medication%20detail.png width=150/></td>
  </tr>
</table>

### Video
<p>Coming soon</p>

## Directory Structure
<table>
  <thead>
    <th>Directory</th>
    <th>Description</th>
  </thead>
  <tr>
    <td><a target="_blank" href=https://github.com/IshiHisashi/Stash-Away/tree/main/UserEnd>Frontend</td>
    <td>This facilitates interface for users such as log-in/sign-up process, medication log, medication hitroty and setting</td>
  </tr>
  <tr>
    <td><a target="_blank" href=https://github.com/IshiHisashi/Stash-Away/tree/main/DriverEnd>Backend</td>
    <td>This takes responsibility for database handling, managing cookies and notification</td>
  </tr>
</table>

## Getting Started
### Deployed version via Vercel
<p>You can access from <a target="_blank" href=https://www.pillbook-hy.com>Here</a></p>
<p>Then, please create your account or try this sample account</p>
<pre>
  <code>
    Email : pillbook_test@gmail.com
    Password : samplepass
  </code>
</pre>


## Development architecture
<p>This application is nicely developed with MERN stack and deployed by Vercel. UI is formed by Tailwind, notification is send via Firebase Cloud Messaging and JWT helps user authentication. Drug data is from public API data provided by government of Canada (<a href='https://health-products.canada.ca/api/documentation/dpd-documentation-en.html#a1'>URL</a>)</p>
<p align='center'> 
<img src='https://github.com/IshiHisashi/hy/blob/main/frontend/public/images/system_architecture_pillbook.jpg' alt='developmet stack' width='600' margin='0 auto'/>
<!--  <img style="margin-right: 300;" src="https://github.com/tandpfun/skill-icons/blob/main/icons/HTML.svg" alt="html" width="40" height="40"/>
  <img src="https://github.com/tandpfun/skill-icons/blob/main/icons/CSS.svg" alt="css" width="40" height="40"/>
 <img src="https://github.com/tandpfun/skill-icons/blob/main/icons/TailwindCSS-Dark.svg" alt="tailwind" width="40" height="40"/> 
  <img src="https://github.com/tandpfun/skill-icons/blob/main/icons/JavaScript.svg" alt="javascript" width="40" height="40"/>
   <img src="https://github.com/tandpfun/skill-icons/blob/main/icons/React-Dark.svg" alt="react" width="40" height="40"/>
    <img src="https://github.com/tandpfun/skill-icons/blob/main/icons/NodeJS-Dark.svg" alt="nodejs" width="40" height="40"/>
     <img src="https://github.com/tandpfun/skill-icons/blob/main/icons/ExpressJS-Dark.svg" alt="expressjs" width="40" height="40"/>
      <img src="https://github.com/tandpfun/skill-icons/blob/main/icons/MongoDB.svg" alt="mongo" width="40" height="40"/>
       <img src="https://github.com/tandpfun/skill-icons/blob/main/icons/Firebase-Dark.svg" alt="firebase" width="40" height="40"/>
       <img src="https://github.com/tandpfun/skill-icons/blob/main/icons/Vercel-Dark.svg" alt="vercel" width="40" height="40"/> -->
       
</p>


## Authors
<table>
  <thead>
    <th></th>
    <th>Developer</th>
    <th>Git account</th>
    <th>Role</th>
  </thead>
  <tr>
    <td><img src=https://github.com/IshiHisashi/Stash-Away/blob/main/UserEnd/images/Ishi_prof.png height=50></td>
    <td>Hisashi Ishihara</td>
    <td><a target="_blank" href=https://github.com/IshiHisashi>@IshiHisashi</td>
      <td>Full-stack developer</td>
  </tr>
  <tr>
    <td><img  target="_blank"src=https://github.com/IshiHisashi/hy/blob/main/frontend/public/images/portrait_yk.jpg height=50></td>
    <td>Yuriko Kikuchi</td>
<!--     <td><a target="_blank" href=#>-</td> -->
    <td><p style='center'>-</p></td>
    <td>UI UX Designer</td>
  </tr>
</table>
