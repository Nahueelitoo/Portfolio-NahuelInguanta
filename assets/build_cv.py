import json
from pathlib import Path
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, PageBreak, KeepTogether, HRFlowable
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.colors import HexColor
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.pagesizes import A4
from xml.sax.saxutils import escape

OUT=Path('output/pdf/CV-Nahuel-Inguanta.pdf')
styles=getSampleStyleSheet()
styles.add(ParagraphStyle(name='CVName',fontName='Helvetica',fontSize=25,leading=29,textColor=HexColor('#231347'),spaceAfter=12))
styles.add(ParagraphStyle(name='CVSubtitle',fontName='Times-Bold',fontSize=11,leading=14,textColor=HexColor('#231347'),spaceAfter=5))
styles.add(ParagraphStyle(name='CVBody',fontName='Times-Roman',fontSize=10.5,leading=13.7,spaceAfter=6))
styles.add(ParagraphStyle(name='CVSection',fontName='Helvetica-Bold',fontSize=11,leading=14,textColor=HexColor('#231347'),spaceBefore=14,spaceAfter=8,keepWithNext=True))
styles.add(ParagraphStyle(name='CVRole',fontName='Times-Bold',fontSize=11,leading=14,spaceBefore=8,spaceAfter=2,keepWithNext=True))
styles.add(ParagraphStyle(name='CVCompany',fontName='Times-Roman',fontSize=10.5,leading=13,spaceAfter=6,keepWithNext=True))
styles.add(ParagraphStyle(name='CVBullet',fontName='Times-Roman',fontSize=10.5,leading=13.4,leftIndent=13,firstLineIndent=-9,spaceAfter=3))

def P(text,kind='CVBody'): return Paragraph(text,styles[kind])
def section(text): return P(text,'CVSection')
def job(title,company,items):
    parts=[P(title,'CVRole'),P(company,'CVCompany')]
    parts += [P('- '+escape(item),'CVBullet') for item in items]
    return KeepTogether(parts)

story=[P('NAHUEL INGUANTA','CVName'),P('Líder de Proyecto y Programador de Videojuegos | Analista Funcional y de Datos | QA Tester','CVSubtitle'),P('La Plata, Buenos Aires, Argentina | Remoto y presencial'),P('<link href="https://www.linkedin.com/in/nahuel-inguanta-13bb0a179/" color="#4e3680">LinkedIn</link> | <link href="https://github.com/Nahueelitoo" color="#4e3680">GitHub</link> | <link href="mailto:nahuelinguanta@gmail.com" color="#4e3680">nahuelinguanta@gmail.com</link>'),HRFlowable(width='100%',thickness=.7,color=HexColor('#9384b0'),spaceAfter=4),section('PERFIL'),P('Profesional de sistemas con más de seis años de experiencia en desarrollo web, bases de datos, análisis funcional, QA y soporte IT. Experiencia en PHP, Python y SQL, automatización de procesos y soluciones de e-commerce. Desde octubre de 2025, fundador de LunaSoft Studios y líder de proyectos de videojuegos, con programación en C#, desarrollo en Unity y diseño de niveles. Actualmente trabajo en la demo de Whispering Claws y combino la gestión de proyectos con el desarrollo técnico.'),section('EXPERIENCIA LABORAL')]
story.append(job('Fundador | Líder de Proyecto | Programador de Videojuegos','LunaSoft Studios - Oct 2025 - Presente',[
'Liderazgo y planificación del proyecto Whispering Claws, videojuego de terror en primera persona cuya demo está en desarrollo.',
'Programación en C# y desarrollo de la demo en Unity 6.4.',
'Diseño de niveles (level design), construcción de escenarios y blocking de entornos.',
'Coordinación de tareas de desarrollo y diseño mediante Trello y Miro, con el objetivo de completar la demo y lanzarla en Steam.'
]))
story.append(job('Analista Funcional | QA Tester (Presencial)','Mayorista Nini - Ago 2025 - Presente',[
'Soporte funcional a 60 vendedores; resolución de incidencias, debugging y testing del e-commerce en tablets y de clientes autogestionables.',
'Automatización de servicios y tareas manuales con Python, con validación y seguimiento de su ejecución.',
'Actualización de bases de datos, mantenimiento de código PHP, consultas SQL y actualización de GLPI.',
'Interlocución con SAP y consultoras; análisis de incidencias mediante transacciones, revisión de IDocs y archivos de texto.',
'Mejora de la eficiencia en la resolución de problemas en un 30-40%, reduciendo tiempos de inactividad.'
]))
story.append(job('Especialista en Soporte IT / Help Desk (Presencial)','Mayorista Nini - Dic 2024 - Jul 2025',[
'Soporte técnico de niveles 2 y 3 en distintas áreas de la empresa.',
'Migración de bases de datos legadas a sistemas modernizados con PHP y MySQL.',
'Troubleshooting y resolución de incidentes técnicos.'
]))
story += [PageBreak(),section('EXPERIENCIA LABORAL - CONTINUACIÓN')]
story.append(job('Cajero | Operaciones de Tesorería (Presencial)','Mayorista Nini - Dic 2022 - Dic 2024',[
'Atención al cliente y operaciones de caja con precisión y confiabilidad.',
'Ascenso a responsabilidades de control de rendiciones y conciliación de recaudaciones.',
'Manejo de altos volúmenes de efectivo sin discrepancias durante dos años consecutivos.'
]))
story.append(job('Project Manager | Data Entry Specialist | Gestor Web','WIWO (Ex The Oniric Company) - Chile, remoto - Dic 2021 - Mar 2022',[
'Liderazgo de un equipo que gestionaba una cartera de seis clientes corporativos chilenos.',
'Asignación de tareas a desarrolladores, programadores y diseñadores, con seguimiento de KPIs y OKRs.',
'Enlace entre clientes y empresa; generación y gestión de tickets según requerimientos.',
'Apoyo en programación para cumplir plazos de entrega.'
]))
story.append(job('Gestor Web | Consultor de Marketing (Presencial)','MI PC Informática - Dic 2019 - Feb 2022',[
'Atención al cliente por canales online y resolución de consultas.',
'Gestión de requerimientos de marketing digital y seguimiento de métricas con Google Analytics.',
'Diseño, desarrollo y mantenimiento de dos sitios web para las sucursales de la empresa.'
]))
story += [section('EDUCACIÓN'),P('<b>Universidad Nacional de La Plata (UNLP)</b><br/>Licenciatura en Sistemas - 2020-2024. Profesorado de la carrera.'),section('IDIOMAS'),P('Español: nativo (C2) | Inglés: avanzado (C1) | Japonés: básico (A1)'),section('HABILIDADES Y CERTIFICACIONES'),P('<b>Videojuegos:</b> C#, Unity 6.4, diseño de niveles, blocking de escenarios, Unreal Engine, Trello y Miro.'),P('<b>Software y datos:</b> PHP, Python, JavaScript, TypeScript, HTML, CSS, SQL Server, PostgreSQL, MySQL, MariaDB, GLPI y SAP.'),P('<b>Herramientas:</b> Git y GitHub, ChatGPT y herramientas de IA, Discord, Google Ads, Google Analytics, Microsoft Excel y Word.'),P('<b>Certificaciones - Platzi:</b> SQL, PostgreSQL, MySQL, análisis de datos, análisis funcional, diseño y desarrollo web, IA y automatización, Git y GitHub, control de versiones, QA para web/PC/mobile y Python para análisis de datos e IA. Más certificados disponibles en LinkedIn.')]

def footer(canvas,doc):
    canvas.saveState();canvas.setStrokeColor(HexColor('#ded9e8'));canvas.line(48,39,A4[0]-48,39);canvas.setFont('Helvetica',8);canvas.setFillColor(HexColor('#716a7a'));canvas.drawString(48,26,'Nahuel Inguanta | Currículum vitae');canvas.drawRightString(A4[0]-48,26,str(doc.page));canvas.restoreState()
doc=SimpleDocTemplate(str(OUT),pagesize=A4,rightMargin=48,leftMargin=48,topMargin=42,bottomMargin=50,title='CV - Nahuel Inguanta',author='Nahuel Inguanta')
doc.build(story,onFirstPage=footer,onLaterPages=footer)
print(OUT)
