import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Imc } from '../../models/imc/imc.module';



@Component({
  selector: 'app-imc',
  imports: [FormsModule],
  templateUrl: './imc.component.html',
  styleUrl: './imc.component.css'
})
export class ImcComponent {

  peso:number;
  altura:number;
  imc:number;
  perfil:string;
  imagenPerfil:string;
  listaImcs:Array<Imc> = [];
  mediaAltura:number = 0;
  mediaPeso:number = 0;
  // listadoIMC: Imc[] = [];

  constructor(){
    this.peso = 0;
    this.altura = 0;
    this.imc = 0;
    this.perfil = "";
    this.imagenPerfil = "";
  }

  calcularIMC(){
    console.log("ha tocado el botón de calcular");
    console.log(`peso: ${this.peso}, altura: ${this.altura}`);
    this.imc = +(this.peso / (this.altura * this.altura)).toFixed(2);
    console.log(`Tu IMC es: ${ this.imc}`);

    if( this.imc < 16){
      console.log("Bajo peso");
      this.perfil = "Bajo peso";
      this.imagenPerfil = '/img/bajo-peso.png';
    } else if( this.imc >= 16 &&  this.imc < 18){
      console.log("Peso bajo");
      this.perfil = "Peso bajo";
      this.imagenPerfil = '/img/peso_bajo.png';
    } else if( this.imc >= 18 &&  this.imc < 25){
      console.log("Peso normal");
      this.perfil = "Peso normal";
      this.imagenPerfil = '/img/peso_normal.png';
    } else if( this.imc >= 25 &&  this.imc < 31){
      console.log("Sobrepeso");
      this.perfil = "Sobrepeso";
      this.imagenPerfil = '/img/sobrepeso.png';
    } else {
      console.log("Obesidad");
      this.perfil = "Obesidad";
      this.imagenPerfil = '/img/obeso.png';
    }

    let imcNuevo = new Imc();
    imcNuevo.peso = this.peso;
    imcNuevo.altura = this.altura;
    imcNuevo.imc = this.imc;
    imcNuevo.perfil = this.perfil;
    imcNuevo.imagenPerfil = this.imagenPerfil;
    this.listaImcs.push(imcNuevo);

    // Calcular medias
    this.mediaAltura = this.listaImcs.reduce((sum, imc) => sum + imc.altura, 0) / this.listaImcs.length;
    this.mediaAltura = +this.mediaAltura.toFixed(2);
    this.mediaPeso = this.listaImcs.reduce((sum, imc) => sum + imc.peso, 0) / this.listaImcs.length;
    this.mediaPeso = +this.mediaPeso.toFixed(2);
  }

  get posicionAgujaIMC(): number {
    const minIMC = 12;
    const maxIMC = 40;
    const imcAjustado = Math.min(maxIMC, Math.max(minIMC, this.imc));
    return ((imcAjustado - minIMC) / (maxIMC - minIMC)) * 100;
  }

  obtenerClaseColorIMC(valorImc: number): string {
    if (valorImc < 16) {
      return 'zona-1';
    } else if (valorImc < 18) {
      return 'zona-2';
    } else if (valorImc < 25) {
      return 'zona-3';
    } else if (valorImc < 31) {
      return 'zona-4';
    }

    return 'zona-5';
  }

  ordenarPorIMC(){
    this.listaImcs.sort((a, b) => a.imc - b.imc);
  } 

  borrarListado(){
    this.listaImcs = [];
    this.mediaAltura = 0;
    this.mediaPeso = 0;
  }

}
