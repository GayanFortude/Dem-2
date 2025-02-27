import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Student } from '../../../types/types';
import { cancelIcon, saveIcon, SVGIcon } from '@progress/kendo-svg-icons';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DateInputsModule, KENDO_DATEINPUTS } from '@progress/kendo-angular-dateinputs';
import { HttpClientJsonpModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { ButtonsModule } from '@progress/kendo-angular-buttons';
import { FormFieldModule, InputsModule } from '@progress/kendo-angular-inputs';
import { LabelModule } from '@progress/kendo-angular-label';
import { DialogModule } from '@progress/kendo-angular-dialog';

@Component({
  selector: 'app-filedownload',
  imports: [ReactiveFormsModule, InputsModule, DialogModule,DateInputsModule, LabelModule,FormFieldModule, ButtonsModule,CommonModule,HttpClientJsonpModule,KENDO_DATEINPUTS],
  templateUrl: './filedownload.component.html',
  styleUrl: './filedownload.component.css'
})
export class FiledownloadComponent {
  @Input() public set isNew(bool: boolean) {
    if(bool==true){
      this.active=true;
      this.editForm.reset()
    }
    else{
      this.active=false;
    }
  }
  @Output() cancel: EventEmitter<undefined> = new EventEmitter();
  @Output() save: EventEmitter<Student> = new EventEmitter();
  public saveIcon: SVGIcon = saveIcon;
  public cancelIcon: SVGIcon = cancelIcon;
  public dateDB: Date = new Date(); 
  public dateUI: Date = new Date(); 
  public active = false;
  public editForm: FormGroup = new FormGroup({
    age: new FormControl(null, [
      Validators.min(0),       
      Validators.max(100),      
      Validators.pattern('^[0-9]*$')
    ]),
    Discontinued: new FormControl(false),
  });
  constructor(){
  }

  public onChange(value: Date): void {
  }
  public onSave(e: Event): void {
    e.preventDefault();
    this.save.emit(this.editForm.value);
    this.active = false;
  }

  public onCancel(e: Event): void {
    e.preventDefault();
    this.closeForm();
  }

  public closeForm(): void {
    this.active = false;
    this.cancel.emit();
  }
}
