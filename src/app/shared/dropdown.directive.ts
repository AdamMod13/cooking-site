import { Directive, ElementRef, HostBinding, HostListener } from '@angular/core';

@Directive({ selector: '[appDropdown]' })
export class DropdownDirective {
  @HostBinding('class.open') isOpen = false;

  constructor(private elRef: ElementRef) { }

  @HostListener('click') toggleOpen() {
    this.isOpen = !this.isOpen
  }
}
