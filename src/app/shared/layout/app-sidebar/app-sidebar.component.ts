import {
  CommonModule
} from '@angular/common';

import {
  Component,
  ElementRef,
  QueryList,
  ViewChildren,
  ChangeDetectorRef,
  OnInit,
  inject
} from '@angular/core';

import {
  NavigationEnd,
  Router,
  RouterModule
} from '@angular/router';

import {
  combineLatest,
  Subscription
} from 'rxjs';

import { SidebarService } from '../../services/sidebar.service';
import { SafeHtmlPipe } from '../../pipe/safe-html.pipe';
import { SidebarWidgetComponent } from './app-sidebar-widget.component';
import { AuthService } from '../../../core/services/auth.service';

type NavItem = {
  name: string;
  icon: string;
  path?: string;
  subItems?: {
    name: string;
    path: string;
  }[];
};

@Component({
  standalone: true,
  selector: 'app-sidebar',
  imports: [
    CommonModule,
    RouterModule,
    SafeHtmlPipe,
    SidebarWidgetComponent
  ],
  templateUrl: './app-sidebar.component.html',
})

export class AppSidebarComponent implements OnInit {

  private authService = inject(AuthService);

  userRole: string = '';

  navItems: NavItem[] = [];

  othersItems: NavItem[] = [];

  openSubmenu: string | null | number = null;

  subMenuHeights: { [key: string]: number } = {};

  @ViewChildren('subMenu')
  subMenuRefs!: QueryList<ElementRef>;

  readonly isExpanded$;
  readonly isMobileOpen$;
  readonly isHovered$;

  private subscription: Subscription = new Subscription();

  constructor(
    public sidebarService: SidebarService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {

    this.isExpanded$ = this.sidebarService.isExpanded$;
    this.isMobileOpen$ = this.sidebarService.isMobileOpen$;
    this.isHovered$ = this.sidebarService.isHovered$;
  }

ngOnInit(): void {

 
  // GET CURRENT USER
 

  const currentUser =
    this.authService.getCurrentUser();

  console.log(
    'CURRENT USER =>',
    currentUser
  );

 
  // NORMALIZE ROLE
 

  this.userRole =
    currentUser?.role
      ?.toLowerCase()
      ?.replace(/\s+/g, '-')
      ?.trim() || '';

  console.log(
    'NORMALIZED ROLE =>',
    this.userRole
  );

 
  // ADMIN NAV ITEMS
 

  if (

    this.userRole === 'admin'

  ) {

    this.navItems = [

      {
        icon: `
        <svg width="20" height="20"
          fill="currentColor"
          viewBox="0 0 24 24">

          <path
            d="M3 13h8V3H3v10zm10 8h8V11h-8v10zM3 21h8v-6H3v6zm10-18v6h8V3h-8z"/>

        </svg>
        `,

        name: 'Dashboard',

        subItems: [

          {
            name: 'Admin Dashboard',
            path: '/admin'
          }

        ]
      },

      {
        icon: `
        <svg width="20" height="20"
          fill="currentColor"
          viewBox="0 0 24 24">

          <path
            d="M19 3H5c-1.1 0-2 .9-2 2v14l4-4h12c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"/>

        </svg>
        `,

        name: 'Complaints',

        subItems: [

          {
            name: 'Add Complaint',
            path: '/admin/addComplaint'
          },

          {
            name: 'My Complaints',
            path: '/user/my-complaints'
          }

        ]
      }

    ];

    console.log(
      'ADMIN NAV ITEMS =>',
      this.navItems
    );

  }

 
  // SUB ADMIN NAV ITEMS
 

  else if (

    this.userRole === 'sub-admin' ||  this.userRole === 'subadmin') {

    this.navItems = [

      {
        icon: `
        <svg width="20" height="20"
          fill="currentColor"
          viewBox="0 0 24 24">

          <path
            d="M12 12c2.7 0 8 1.3 8 4v2H4v-2c0-2.7 5.3-4 8-4zm0-2a4 4 0 100-8 4 4 0 000 8z"/>

        </svg>
        `,

        name: 'SubAdmin Dashboard',

        subItems: [

          {
            name: 'SubAdmin Dashboard',
            path: '/sub-admin'
          },
           {
            name: 'Dummy Comp',
            path: '/sub-admin'
          },
          {
            name: 'Dummy Comp2',
            path: '/sub-admin'
          }

        ]
      }

    ];

    console.log(
      'SUB ADMIN NAV ITEMS =>',
      this.navItems
    );

  }

 
  // NO ROLE FOUND
 

  else {

    this.navItems = [];

    console.log(
      'NO VALID ROLE FOUND'
    );

  }

 
  // ROUTER EVENTS
 

  this.subscription.add(

    this.router.events.subscribe(event => {

      if (event instanceof NavigationEnd) {

        this.setActiveMenuFromRoute(
          this.router.url
        );

      }

    })

  );

 
  // INITIAL ACTIVE MENU
 

  this.setActiveMenuFromRoute(
    this.router.url
  );

}

  ngOnDestroy(): void {

    this.subscription.unsubscribe();
  }

  isActive(path: string): boolean {

    return this.router.url === path;
  }

  toggleSubmenu(section: string, index: number) {

    const key = `${section}-${index}`;

    if (this.openSubmenu === key) {

      this.openSubmenu = null;

      this.subMenuHeights[key] = 0;

    } else {

      this.openSubmenu = key;

      setTimeout(() => {

        const el = document.getElementById(key);

        if (el) {

          this.subMenuHeights[key] = el.scrollHeight;

          this.cdr.detectChanges();
        }

      });

    }
  }

  onSidebarMouseEnter() {

    this.isExpanded$
      .subscribe(expanded => {

        if (!expanded) {

          this.sidebarService.setHovered(true);
        }

      }).unsubscribe();
  }

  private setActiveMenuFromRoute(currentUrl: string) {

    const menuGroups = [
      {
        items: this.navItems,
        prefix: 'main'
      }
    ];

    menuGroups.forEach(group => {

      group.items.forEach((nav, i) => {

        if (nav.subItems) {

          nav.subItems.forEach(subItem => {

            if (currentUrl === subItem.path) {

              const key = `${group.prefix}-${i}`;

              this.openSubmenu = key;

              setTimeout(() => {

                const el = document.getElementById(key);

                if (el) {

                  this.subMenuHeights[key] =
                    el.scrollHeight;

                  this.cdr.detectChanges();
                }

              });

            }

          });

        }

      });

    });

  }

  onSubmenuClick() {

    this.isMobileOpen$
      .subscribe(isMobile => {

        if (isMobile) {

          this.sidebarService
            .setMobileOpen(false);
        }

      }).unsubscribe();

  }

}