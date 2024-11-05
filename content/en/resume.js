const data = {
  experience: [
    {
      name: 'Onestic',
      url: 'https://onestic.com',
      location: 'Valencia',
      dates: 'Mar 2020 - Jan 2024',
      desc: 'Creation of tools (Python, Bash Scripting) and automation (Concourse, GitHub Actions) for developers. Dockerisation of projects. Code standardisation and a lot of testing (Python, JavaScript, Typescript) to ensure the best possible quality. Mentoring of newcomers during the onboarding process and beyond. Creation of a centralised log viewer (Promtail, Loki, Grafana). Creation of tools (Django, django_rest_framework, celery) to automate and speed up the creation of machines. Creation, configuration and maintenance (SaltStack, Terraform) of machines in Linux environment (CentOS, Ubuntu)',
      extendedDesc: `Facilitate synergies and work between development and systems teams through automation, testing (TDD and BDD) and dockerisation of projects to ensure everyone works efficiently and minimising the appearance of errors. Standardisation of code to ensure its quality and homogeneity. Testing, testing and more testing; the core of it all. Mentoring of newcomers, supervising PRs, teaching the company's philosophy and acting as a guide both during the onboarding process and afterwards.<br/><br/>
      Centralised log viewer of all the company's machines, using the Promtail, Loki and Grafana services, which not only made it possible to monitor the services of the machines without accessing the machine itself, but also to create panels and alerts that can warn through a communication channel if something is detected as not working properly.<br/><br/>
      Tool created in Django with django_rest_framework (api), celery (queue management) and gui (JS, HTML and CSS) to automate and speed up the process of creating machines for clients.<br/><br/>
      Main programming languages: Python ( typed), Bash Scripting and JavaScript/Typescript.<br/>
      Main system tools used: Terraform (HCL) and SaltStack (yaml, jinja).<br/>
      Main orchestration tools: Concourse and GitHub Actions.<br/><br/>
      Configuration and management of services in Linux environments (CentOS and Ubuntu).`,
    },
    {
      name: 'Avantio',
      url: 'https://www.avantio.es',
      location: 'Paterna',
      dates: 'Sep 2019 - Feb 2020',
      desc: 'Full Stack Developer (MEAN Stack)',
      extendedDesc: 'Full Stack Developer (MEAN Stack)',
    },
    {
      name: 'Avantio',
      url: 'https://www.avantio.es',
      location: 'Paterna',
      dates: 'Mar 2019 - Sep 2019',
      desc: 'Frontend Web Developer',
      extendedDesc: 'Frontend Web Developer',
    },
    {
      name: 'Churba & Portillo',
      url: 'https://www.churbayportillo.com/',
      location: 'Murcia',
      dates: 'Jan 2010 - Jun 2010',
      desc: `Graphic Designer and Web Developer. Maintenance and management of a VPS`,
      extendedDesc: `Graphic Designer and Web Developer. Maintenance and management of a VPS`,
    },
    {
      name: 'CP San Luis',
      location: 'Buñol',
      dates: 'Sep 2008 - Jun 2009',
      desc: 'Computer teacher for students of all primary education courses',
      extendedDesc: 'Computer teacher for students of all primary education courses',
    },
    {
      name: 'Jepsi',
      location: 'Castellón',
      dates: 'Aug 2004 - Jan 2007',
      desc: `Customer service, technical troubleshooting and software
        installation in Linux environments`,
      extendedDesc: `Customer service, technical troubleshooting and software
        installation in Linux environments`,
    },
  ],
  me: `
    <p>
      Hi! Everyone knows me as <strong>Javi</strong> and I'm a techie.
      Since I was a kid I've been passionate about computers and generally any
      technological device. Since I started programming as a child I knew I
      wanted to continue doing it for the rest of my life; if I can also turn
      my greatest hobby into my profession it will be a dream come true.
    </p>
    <p>
      In my personal projects I've applied most of the best practices
      recommended in <em>Extreme Programming Explained</em>, by Kent Beck;
      also the knowledge acquired by reading <em>Clean Code</em>, by
      Robert C. Martin and <em>Refactoring</em> by Martin Fowler and Kent Beck.
      I totally share the idea of writing code you can be proud of.
    </p>
    <p>
      I'm a self-taught person, and with my academic background, I feel ready
      to work in a team using current technologies with a focus on good practices.
      My main characteristic is the passion for what I do and the desire to
      learn something new every day.
    </p>
  `,
  education: [
    {
      name: 'CIPFP Complejo Educativo de Cheste',
      url: 'http://www.fpcheste.com',
      location: 'Cheste',
      dates: '2017 - 2019',
      desc: 'Higher National Diploma, Multi-platform Applications Development (EQF 5)',
      extendedDesc: 'Higher National Diploma, Multi-platform Applications Development (EQF 5)',
    },
  ],
  freelance: [
    {
      name: 'josemariatena.es',
      desc: 'Static presentation page with contact form',
      languages: ['css3', 'html5', 'php'],
    },
    {
      name: 'profesionaldelapsicologia.es',
      desc: 'Website presenting the psychological office and its services',
      languages: ['css3', 'html5', 'wordpress'],
    },
    {
      name: 'numismaticallamas.es',
      desc: 'E-commerce selling coins, banknotes and medals',
      languages: ['php', 'zencart'],
    },
  ],
  projects: [
    {
      name: 'sargantanacode.es',
      desc: `Web application to teach programming<br />
      Currently all the content of that website has been moved to the blog of this page.`,
      languages: ['html5', 'scss', 'rubyonrails'],
    },
    {
      name: 'fjp.es',
      desc: `Personal website and blog<br />
      It's also an open source application; code available on GitHub`,
      languages: ['gatsbyjs', 'html5', 'scss'],
    },
  ],
  volunteering: [
    {
      name: 'VOST Euskadi',
      dates: 'Feb 2018 - Oct 2018',
      desc: 'Backend and frontend applications for emergency management',
      languages: ['angular', 'materialdesign', 'nodejs'],
    },
  ],
  talks: [
    {
      name: 'HTML5: el lenguaje de la web',
      location: 'Cheste',
      dates: '14 Dec 2018',
      desc: 'Workshop at The Hour of Code',
      extendedDesc: 'Workshop at The Hour of Code',
    },
  ],
}

export default data
