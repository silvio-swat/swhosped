import { provideRouter, Route, withEnabledBlockingInitialNavigation, withInMemoryScrolling } from '@angular/router';
import { CadAcomodacaoComponent } from './pages/acomodacao/cad-acomodacao/cad-acomodacao.component';
import { ReservaFormComponent } from './pages/reserva/reserva-form/reserva-form.component';
import { ReservaClienteComponent } from './pages/reserva/reserva-cliente/reserva-cliente.component';

import { PublicLayoutComponent } from './layouts/public-layout/public-layout.component';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { HomeComponent } from './pages/home/home.component';
import { AdminDashboardComponent } from './pages/admin-dashboard/admin-dashboard.component';
import { ReservaAdminComponent } from './pages/reserva/reserva-admin/reserva-admin.component';
import { LoginComponent } from './pages/usuario/login/login.component'; 

import { AuthGuard } from './guards/auth.guard';
import { AdminGuard } from './guards/admin.guard';
import { CadUserClientComponent } from './pages/usuario/cad-user-client/cad-user-client.component';


export const appRoutes: Route[] = [
    //{ path: '', component: HomeComponent },
    { path: '', component: PublicLayoutComponent,
        children: [
            { path: '', component: HomeComponent },
            { path: 'cad-usuario', component: CadUserClientComponent },    
            { path: 'login', component: LoginComponent },            

            { path: 'reservar', component: ReservaFormComponent },               
            { path: 'reserva-cliente', component: ReservaClienteComponent }
            // outras rotas públicas
        ]        
     },               
    { path: 'admin',
      component: AdminLayoutComponent,
      canActivate: [AuthGuard, AdminGuard], // Protege toda a rota /admin
        children: [
            { path: '', component: AdminDashboardComponent },
            { path: 'cad-acomodacao',     component: CadAcomodacaoComponent },
            { path: 'acomodacoes/editar', component: CadAcomodacaoComponent } ,
            { path: 'reserva-admin', component: ReservaAdminComponent },                    
            // outras rotas administrativas
        ]        
    },               
            
];

// Configuração do provedor de rotas

export const APP_ROUTER_PROVIDERS = [
    provideRouter(
        appRoutes,
        withInMemoryScrolling({
        scrollPositionRestoration: 'top',
        anchorScrolling: 'enabled'
        }),
        withEnabledBlockingInitialNavigation() // Opcional, para melhor SSR
    )
];
