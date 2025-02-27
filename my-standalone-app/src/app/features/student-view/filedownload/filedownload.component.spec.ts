import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FiledownloadComponent } from './filedownload.component';

describe('FiledownloadComponent', () => {
  let component: FiledownloadComponent;
  let fixture: ComponentFixture<FiledownloadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FiledownloadComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FiledownloadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
