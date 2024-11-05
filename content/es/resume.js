const data = {
  experience: [
    {
      name: 'Glue Digital',
      url: 'https://glue.digital',
      location: 'Vigo (remoto)',
      role: 'Full Stack Developer',
      dates: 'Abr 2024 - Presente',
      desc: 'Desarrollo y mantenimiento de backends en Typescript (Nest.js) y Python (FastAPI) siguiendo REST y OpenAPI, documentados con Swagger. Uso de MongoDB y ElasticSearch para proyectos de alto tráfico. Además, desarrollo de funcionalidades en una aplicación PHP (Laravel 11), tanto en frontend como backend, y en una aplicación React. Creación de productores y consumidores de Kafka para conectar 11 microservicios. Principales lenguajes: Python, JavaScript/Typescript y PHP. Herramientas de testing: Pytest, Jest y PHPUnit.',
      extendedDesc: `Mantenimiento y creación de backends para API tanto en Typescript (Nest.js) como en Python (FastAPI) siguiendo la arquitectura REST y la especificación OpenAPI; todo ello documentado con Swagger para un correcto entendimiento del API por parte de todos aquellos que la puedan consumir. Como base de datos: MongoDB para almacenar información y ElasticSearch para una consulta más rápida con cache para proyectos con un alto número de peticiones a la base de datos.<br/><br/>
      Mantenimiento y desarrollo de nuevas funcionalidades en una aplicación escrita en PHP (Laravel 11), realizando tareas tanto de backend como de frontend, haciendo además peticiones a APIs externas mediante Guzzle.<br/><br/>
      Mantenimiento y desarrollo de nuevas funcionalidades en una aplicación escrita en JavaScript (React).<br/><br/>
      Hito destacado: creación de productores y consumidores de Apache Kafka (Azure Event Hubs) para conectar mediante eventos 11 microservicios, usando para ello node-rdkafka en Typescript (Nest.js) y fastavro en Python (FastAPI). Creadas también suites de tests (unit/e2e) de todos los servicios.<br/><br/>
      Principales lenguajes de programación: Python (tipado), JavaScript/Typescript y PHP.<br/>
      Herramientas de testing utilizadas: Pytest (Python), Jest (JavaScript/Typescript) y PHPUnit (PHP).`,
    },
    {
      name: 'Onestic',
      url: 'https://onestic.com',
      location: 'Valencia (remoto)',
      role: 'SRE / DevOps',
      dates: 'Mar 2020 - Ene 2024',
      desc: 'Creación de herramientas (Python, Bash Scripting) de automatización (Concourse, GitHub Actions) para los desarrolladores. <em>Dockerización</em> de  proyectos. Estandarización de código y muchisimo testing (Python, JavaScript, Typescript) para asegurar la mejor calidad posible.  Mentorizacion a compañeros recién llegados durante el proceso de onboarding y más allá. Creador de un visualizador de logs centralizado (Promtail, Loki, Grafana). Creación de herramienta (Django, django_rest_framework, celery) para automatizar y agilizar la creación de máquinas. Creación, configuración y mantenimiento (SaltStack, Terraform) de máquinas en entorno Linux (CentOS, Ubuntu)',
      extendedDesc: `Facilitar sinergias y trabajo entre equipos de desarrollo y de sistemas mediante la automatización, pruebas (TDD y BDD) y <em>dockerización</em> de proyectos para que todo el mundo trabaje de forma eficiente y minimizando la aparición de errores. Estandarizaciones de código para asegurar la calidad y homogeneidad del mismo. Testing, testing y más testing; la clave de todo. Mentorización a recién llegados, supervisando PRs, enseñando la filosofía de la empresa y haciendo de guía tanto durante el proceso de onboarding como posteriormente.<br/><br/>
      Visualizador centralizado de logs de todas las máquinas de la empresa, mediante el uso de los servicios Promtail, Loki y Grafana, a través del cual no sólo se podían monitorizar los servicios de las máquinas sin entrar a la propia máquina en sí sino también crear paneles y alertas que puedan avisar mediante un canal de comunicación si se detecta que algo no funciona bien.<br/><br/>
      Herramienta creada en Django con django_rest_framework (api), celery (gestión de colas) y gui (JS, HTML y CSS) para automatizar y agilizar el proceso de creación de máquinas para clientes.<br/><br/>
      Principales lenguajes de programación: Python (tipado), Bash Scripting y JavaScript/Typescript.<br/>
      Principales herramientas de sistemas utilizadas: Terraform (HCL) y SaltStack (yaml, jinja).<br/>
      Principales herramientas de orquestación: Concourse y GitHub Actions.<br/><br/>
      Configuración y gestión de servicios en entornos Linux (CentOS y Ubuntu)`,
    },
    {
      name: 'Avantio',
      url: 'https://www.avantio.es',
      location: 'Paterna',
      role: 'Full Stack Developer',
      dates: 'Mar 2019 - Feb 2020',
      desc: 'Desarrollador web full-stack (MEAN Stack)',
      extendedDesc: 'Desarrollador web full-stack (MEAN Stack)',
    },
    {
      name: 'Churba & Portillo',
      url: 'https://www.churbayportillo.com/',
      location: 'Murcia (remoto)',
      role: 'Web Developer',
      dates: 'Ene 2010 - Jun 2010',
      desc: `Diseñador gráfico y desarrollador web. Mantenimiento y administración de un VPS`,
      extendedDesc: `Diseñador gráfico y desarrollador web. Mantenimiento y administración de un VPS`,
    },
    {
      name: 'CP San Luis',
      location: 'Buñol',
      role: 'Profesor',
      dates: 'Sep 2008 - Jun 2009',
      desc: 'Profesor de informática para niños de todos los cursos de primaria',
      extendedDesc: 'Profesor de informática para niños de todos los cursos de primaria',
    },
    {
      name: 'Jepsi',
      location: 'Castellón (remoto)',
      role: 'Ops',
      dates: 'Ago 2004 - Ene 2007',
      desc: `Atención al cliente, resolución de problemas técnicos e instalación
        de software en entornos Linux `,
      extendedDesc: `Atención al cliente, resolución de problemas técnicos e instalación
        de software en entornos Linux `,
    },
  ],
  me: `
    <p>
      ¡Hola! Todo el mundo me conoce como <strong>Javi</strong> y soy un amante
      de la tecnología. Desde que era un niño me apasionan los ordenadores y,
      en general, cualquier aparato tecnológico. Desde que empecé a programar
      siendo bien pequeño supe que quería seguir haciéndolo durante el resto de
      mi vida; si además puedo convertir mi mayor afición en mi oficio será
      un sueño cumplido.
    </p>
    <p>
      En mis proyectos personales he aplicado la mayor parte de prácticas que se
      recomiendan en <em>Extreme Programming Explained</em>, de Kent Beck;
      también los conocimientos adquiridos leyendo <em>Clean Code</em>, de
      Robert C. Martin y <em>Refactoring</em> de Martin Fowler y Kent Beck.
      Comparto totalmente la idea de escribir un código del que puedas sentirte
      orgulloso.
    </p>
    <p>
      Me considero una persona autodidacta, y junto con lo que me ha aportado mi
      formación académica, me siento preparado para trabajar en equipo usando
      tecnologías actuales haciendo hincapié en el uso de buenas prácticas.
      Mi principal característica es la pasión por lo que hago y muchas ganas de
      aprender cada día algo nuevo.
    </p>
  `,
  education: [
    {
      name: 'CIPFP Complejo Educativo de Cheste',
      url: 'http://www.fpcheste.com',
      location: 'Cheste',
      dates: '2017 - 2019',
      desc: 'Técnico superior, Desarrollo de aplicaciones multiplataforma (EQF 5)',
      extendedDesc: 'Técnico superior, Desarrollo de aplicaciones multiplataforma (EQF 5)',
    },
  ],
  freelance: [
    {
      name: 'josemariatena.es',
      desc: 'Página estática de presentación con formulario de contacto',
      languages: ['css3', 'html5', 'php'],
    },
    {
      name: 'profesionaldelapsicologia.es',
      desc: 'Página web de presentación del gabinete psicológico y sus servicios',
      languages: ['css3', 'html5', 'wordpress'],
    },
    {
      name: 'numismaticallamas.es',
      desc: 'Tienda online de venta de monedas, billetes y medallas',
      languages: ['php', 'zencart'],
    },
  ],
  projects: [
    {
      name: 'sargantanacode.es',
      desc: `Aplicación web para enseñar a programar<br />
      Actualmente todo el contenido de esa web ha sido migrado al blog de esta página`,
      languages: ['html5', 'scss', 'rubyonrails'],
    },
    {
      name: 'fjp.es',
      url: 'https://fjp.es',
      desc: `Página web personal y blog<br />
      Es además una aplicación de código abierto; código disponible en GitHub`,
      languages: ['gatsbyjs', 'html5', 'scss'],
    },
  ],
  volunteering: [
    {
      name: 'VOST Euskadi',
      dates: 'Feb 2018 - Oct 2018',
      desc: 'Aplicaciones backend y frontend para gestión de emergencias',
      languages: ['angular', 'materialdesign', 'nodejs'],
    },
  ],
  talks: [
    {
      name: 'HTML5: el lenguaje de la web',
      location: 'Cheste',
      dates: '14 Dic 2018',
      desc: 'Taller en La hora del código',
      extendedDesc: 'Taller en La hora del código',
    },
  ],
}

export default data
