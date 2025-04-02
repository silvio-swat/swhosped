import { provideRouter, Route, withEnabledBlockingInitialNavigation, withInMemoryScrolling } from '@angular/router';
import { CadastroUsuarioComponent } from './pages/cadastro-usuario/cadastro-usuario.component';
import { CadAcomodacaoComponent } from './pages/cad-acomodacao/cad-acomodacao.component';
import { ReservaComponent } from './pages/reserva-form/reserva-form.component';
import { ReservaClienteComponent } from './pages/reserva-cliente/reserva-cliente.component';

import { PublicLayoutComponent } from './layouts/public-layout/public-layout.component';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { HomeComponent } from './pages/home/home.component';
import { AdminDashboardComponent } from './pages/admin-dashboard/admin-dashboard.component';
import { ReservaAdminComponent } from './pages/reserva-admin/reserva-admin.component';


export const appRoutes: Route[] = [
    //{ path: '', component: HomeComponent },
    { path: '', component: PublicLayoutComponent,
        children: [
            { path: '', component: HomeComponent },
            { path: 'cad-usuario', component: CadastroUsuarioComponent },    

            { path: 'reservar', component: ReservaComponent },               
            { path: 'reserva-cliente', component: ReservaClienteComponent },
            // outras rotas públicas

        ]        
     },               
    { path: 'admin', component: AdminLayoutComponent,
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
