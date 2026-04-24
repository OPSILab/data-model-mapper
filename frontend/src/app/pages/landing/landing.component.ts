import { AfterViewInit, Component, ElementRef, HostListener, QueryList, ViewChild, ViewChildren, ViewEncapsulation } from '@angular/core';

interface Connection {
  from: string;
  to: string;
}

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class LandingComponent implements AfterViewInit {
  @ViewChild('connectionsSvg', { static: true }) connectionsSvg!: ElementRef<SVGSVGElement>;
  @ViewChildren('storySection') sections!: QueryList<ElementRef<HTMLElement>>;
  connections: Connection[] = [
    { from: 'minio', to: 'mapper' },
    { from: 'db', to: 'mapper' },
    { from: 'mapper', to: 'orion' },
    { from: 'mapper', to: 'client' }
  ];
  constructor(private el: ElementRef) { }

  ngAfterViewInit(): void {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target as HTMLElement;
          el.style.opacity = '1';
          el.style.transform = 'translateY(0)';
          obs.unobserve(el); // animate once
        }
      });
    }, { threshold: 0.2 });

    this.sections.forEach(section => {
      const el = section.nativeElement;
      el.style.opacity = '0';
      el.style.transform = 'translateY(50px)';
      el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';

      observer.observe(el);
    });
    //
    /*this.sections.forEach(section => {
      const el = section.nativeElement;
      el.style.opacity = '0';
      el.style.transform = 'translateY(50px)';
      el.style.transition = 'all 0.8s ease';
    });

    setTimeout(() => this.revealOnScroll(), 2000);*/
    //this.revealOnScroll();
    //this.initSectionReveal();
    //setTimeout(() => this.initSectionReveal(), 10000);
    this.drawConnections();
  }

  @HostListener('window:resize')
  onResize() {
    this.drawConnections();
  }

  @HostListener('window:scroll')
  onScroll() {
    this.revealOnScroll();
  }

  private initSectionReveal() {
    const sections = this.el.nativeElement.querySelectorAll('.story-section') as NodeListOf<HTMLElement>;
    sections.forEach(section => {
      section.style.opacity = '0';
      section.style.transform = 'translateY(50px)';
      section.style.transition = 'all 0.8s ease';
    });
  }

  @HostListener('window:scroll', [])
  revealOnScroll() {
    const scrollTop = window.pageYOffset;
    const windowHeight = window.innerHeight;

    this.sections.forEach(section => {
      const el = section.nativeElement;
      const sectionTop = el.offsetTop;

      if (scrollTop + windowHeight > sectionTop + 100) {
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
      }
    });
  }

  drawConnections() {
    const svg = this.connectionsSvg.nativeElement;

    // reset + defs
    svg.innerHTML = `
      <defs>
        <marker id="arrow" markerWidth="10" markerHeight="10" refX="10" refY="5" orient="auto">
          <polygon points="0,0 10,5 0,10" fill="#3b82f6"></polygon>
        </marker>
      </defs>
    `;

    const containerRect = svg.getBoundingClientRect();

    this.connections.forEach(conn => {
      const from = document.getElementById(conn.from);
      const to = document.getElementById(conn.to);
      if (!from || !to) return;

      const fromRect = from.getBoundingClientRect();
      const toRect = to.getBoundingClientRect();

      const x1 = fromRect.left + fromRect.width / 2 - containerRect.left;
      const y1 = fromRect.top + fromRect.height / 2 - containerRect.top;
      const x2 = toRect.left + toRect.width / 2 - containerRect.left;
      const y2 = toRect.top + toRect.height / 2 - containerRect.top;

      const dx = Math.abs(x2 - x1) * 0.4;
      const path = `M ${x1},${y1} C ${x1 + dx},${y1} ${x2 - dx},${y2} ${x2},${y2}`;

      const newPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      newPath.setAttribute('d', path);
      newPath.setAttribute('marker-end', 'url(#arrow)');
      svg.appendChild(newPath);
    });
  }

  attachMapHandlers() {
    const tooltip = document.getElementById('countryTooltip');
    const countries = document.querySelectorAll<HTMLElement>('.country');
    if (!tooltip || !countries.length) return;

    countries.forEach(country => {
      country.addEventListener('mouseenter', (e: Event) => {
        const target = e.currentTarget as HTMLElement;
        const countryName = target.dataset['country'] ?? '';
        const companies = target.dataset['companies'] ?? '';
        if (companies) {
          (tooltip.querySelector('.tooltip-title') as HTMLElement).textContent = countryName;
          (tooltip.querySelector('.tooltip-companies') as HTMLElement).textContent = `${companies} aziende registrate`;
          tooltip.classList.add('active');
        }
      });

      country.addEventListener('mousemove', (e: MouseEvent) => {
        tooltip.style.left = e.pageX + 10 + 'px';
        tooltip.style.top = e.pageY - 40 + 'px';
      });

      country.addEventListener('mouseleave', () => tooltip.classList.remove('active'));
    });
  }

  // CTA + demo (in Angular qui potresti aprire dialog/moduli reali)
  simulateDataFlow() { alert('Simulate data flow'); }
  showDashboard() { alert('Open dashboard'); }
  exploreAPI() { alert('API Explorer'); }
  startDemo() { alert('Demo requested! You will be contacted for a presentation.'); }
}
