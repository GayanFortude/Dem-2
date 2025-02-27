import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { FormFieldModule, InputsModule } from '@progress/kendo-angular-inputs';
import { DialogModule } from "@progress/kendo-angular-dialog";
import { LabelModule } from "@progress/kendo-angular-label";
import { cancelIcon, saveIcon, SVGIcon } from '@progress/kendo-svg-icons';
import { Student } from '../../../types/types';
import { CommonModule } from '@angular/common';
import { HttpClientJsonpModule } from '@angular/common/http';
import { DateInputsModule, KENDO_DATEINPUTS } from '@progress/kendo-angular-dateinputs';
import { ButtonsModule } from '@progress/kendo-angular-buttons';
@Component({
  selector: 'app-student-view-edit-modal',
  imports: [ReactiveFormsModule, InputsModule, DialogModule,DateInputsModule, LabelModule,FormFieldModule, ButtonsModule,CommonModule,HttpClientJsonpModule,KENDO_DATEINPUTS],
  templateUrl: './student-view-edit-modal.component.html',
  styleUrl: './student-view-edit-modal.component.css'
})

export class StudentViewEditModalComponent {
  @Input() public isNew = false;
  @Input() public set model(student: Student) {
    
    if(student!=undefined){
      if(Object.keys(student).length !== 0){
        this.active = true;
      }
      if(student.dob!=null){
        this.dateDB=new Date(student.dob)
      }
      else{
        this.dateDB=student.dob
      }
      this.editForm.reset({
        ...student,
        dob:this.dateDB
      });
    }
  }
  @Output() cancel: EventEmitter<undefined> = new EventEmitter();
  @Output() save: EventEmitter<Student> = new EventEmitter();


  public dateDB: Date = new Date(); 
  public dateUI: Date = new Date(); 
  public saveIcon: SVGIcon = saveIcon;
  public cancelIcon: SVGIcon = cancelIcon;
  public active = false;
  public editForm: FormGroup = new FormGroup({
    id:new FormControl(),
    dob: new FormControl(new Date(), [Validators.required, this.pastDateValidator]),
    email: new FormControl('',[Validators.required, Validators.email]),
    fname: new FormControl(),
    lname: new FormControl(),
    Discontinued: new FormControl(false),
  });
  constructor(){
  }

  pastDateValidator(control: AbstractControl): ValidationErrors | null { //Date validator
    const inputDate = new Date(control.value);
    const today = new Date();
    today.setHours(0, 0, 0, 0); 

    return inputDate >= today ? { futureDate: true } : null;
  }
  public onChange(value: Date): void {
    this.dateUI=value //Catch date change
  }
  public onSave(e: Event): void {
    this.editForm.patchValue({dob:this.dateUI})
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
