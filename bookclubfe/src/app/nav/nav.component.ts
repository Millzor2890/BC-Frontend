import { Component, OnInit,Renderer2, ElementRef } from '@angular/core';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {

  constructor(
    private el: ElementRef,
    private render:Renderer2
  ) { }

  ngOnInit() 
  {

  }


  toggleBurgerMenu(event: any)
  {
    var isActive = event.target.classList.contains("is-active");
    let burgerMenu = this.el.nativeElement.getElementsByClassName('navbar-burger')[0];
    let navMenu = this.el.nativeElement.getElementsByClassName('navbar-menu')[0];
    console.log(navMenu);


    if(isActive)
    {
    this.render.removeClass(burgerMenu,"is-active");
    this.render.removeClass(navMenu,"is-active");       

    }
    else{
      this.render.addClass(event.target,"is-active");
      this.render.addClass(navMenu,"is-active");  
    }
    
  }

}
