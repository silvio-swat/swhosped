import { Route } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { CadastroUsuarioComponent } from './pages/cadastro-usuario/cadastro-usuario.component';
import { CadAcomodacaoComponent } from './pages/cad-acomodacao/cad-acomodacao.component';

export const appRoutes: Route[] = [
    { path: '', component: HomeComponent },
    { path: 'cad-usuario', component: CadastroUsuarioComponent },    
    { path: 'cad-acomodacao', component: CadAcomodacaoComponent },         
];
