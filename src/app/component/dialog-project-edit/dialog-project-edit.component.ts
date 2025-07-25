import {
	Component,
	inject,
	signal,
	ViewChild,
	Input,
	EventEmitter,
	Output,
} from "@angular/core";
import {
	DateAdapter,
	MAT_DATE_FORMATS,
	MAT_NATIVE_DATE_FORMATS,
	MatNativeDateModule,
	NativeDateAdapter,
} from "@angular/material/core";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatError, MatInputModule } from "@angular/material/input";
import type {
	AlterProject,
	NameListItem,
	NameListItemByRole,
	NewProjectInput,
	Project,
	UserRoleChange,
} from "../../model/format.type";
import {
	FormControl,
	FormGroup,
	FormsModule,
	NgModel,
	ReactiveFormsModule,
	Validators,
} from "@angular/forms";
import { NgIf } from "@angular/common";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatButtonModule } from "@angular/material/button";
import { UserSelectorComponent } from "../user-selector/user-selector.component";
import { DataProcessingService } from "../../service/data-processing.service";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { TextFieldModule } from "@angular/cdk/text-field";

@Component({
	selector: 'app-dialog-project-edit',
	imports: [
		MatDatepickerModule,
		MatNativeDateModule,
		MatInputModule,
		MatError,
		FormsModule,
		NgIf,
		MatFormFieldModule,
		ReactiveFormsModule,
		MatButtonModule,
		TextFieldModule,
	],
	templateUrl: './dialog-project-edit.component.html',
	styleUrl: './dialog-project-edit.component.css',
	providers: [
		{ provide: DateAdapter, useClass: NativeDateAdapter },
		{ provide: MAT_DATE_FORMATS, useValue: MAT_NATIVE_DATE_FORMATS },
	],
})
export class DialogProjectEditComponent {
	dataService = inject(DataProcessingService);
	dialogData = inject(MAT_DIALOG_DATA);
	@Input() currentPic = signal<NameListItem>({ name: "", id: 0 });
	@Input() project!: Project;
	dialogRef = inject(MatDialogRef<DialogProjectEditComponent>);

	projectForm = new FormGroup({
		projectName: new FormControl("", [Validators.required]),
		description: new FormControl("", [Validators.required]),
		// A nested group for the date range
		dateRange: new FormGroup({
			start: new FormControl<Date | null>(null, [Validators.required]),
			end: new FormControl<Date | null>(null, [Validators.required]),
		}),
		// A control to hold the ID from the search bar
		picId: new FormControl<number | null>(null, [Validators.required]),
	});

	get f() {
		return this.projectForm.controls;
	}

	ngOnInit() {
		if (this.project) {
			console.log("project edit mode");
			this.projectForm.patchValue({
				projectName: this.project.projectName,
				description: this.project.description,
				dateRange: {
					start: this.project.startDate
						? new Date(this.project.startDate)
						: null,
					end: this.project.targetDate
						? new Date(this.project.targetDate)
						: null,
				},
				picId: 0,
			});
			this.currentPic().name = this.project.picName;
		}
	}
	checkDateRangeHasValue(): boolean {
		const dateRangeGroup = this.projectForm.get("dateRange");

		if (dateRangeGroup) {
			const { start, end } = dateRangeGroup.value;
			return !!start || !!end;
		}

		return false;
	}

	newProjectCreate(userRoles: UserRoleChange[]) {
		if (this.projectForm.valid) {
			// Form is valid, proceed with creating the project
			const newProject: NewProjectInput = {
				projectName: this.projectForm.value.projectName || "",
				description: this.projectForm.value.description || "",
				createdBy: Number(this.dataService.getUserId()),
				startDate: this.projectForm.value.dateRange?.start || null,
				targetDate: this.projectForm.value.dateRange?.end || null,
				userRoles,
				picId: this.currentPic().id,
			};
			console.log("Form is valid. Submitting:", newProject);
			this.dataService.postNewProject(newProject).subscribe(() => {
				this.dialogRef.close(true);
			});
		} else {
			console.log("Form is invalid. Marking all as touched.");
			this.projectForm.markAllAsTouched();
		}
	}

	projectEdit(userRoles: UserRoleChange[]) {
		if (this.projectForm.valid) {
			const alterProject: AlterProject = {
				projectId: this.project.projectId,
				projectName:
					this.projectForm.value.projectName === this.project.projectName
						? null
						: this.projectForm.value.projectName || null,
				description:
					this.projectForm.value.description === this.project.description
						? null
						: this.projectForm.value.description || null,
				startDate:
					this.projectForm.value.dateRange?.start &&
					new Date(this.project.startDate).getTime() ===
						this.projectForm.value.dateRange.start.getTime()
						? null
						: this.projectForm.value.dateRange?.start || null,
				targetDate:
					this.projectForm.value.dateRange?.end &&
					new Date(this.project.targetDate).getTime() ===
						this.projectForm.value.dateRange.end.getTime()
						? null
						: this.projectForm.value.dateRange?.end || null,
				userRoles,
				picId: this.currentPic().id === 0 ? null : this.currentPic().id,
			};

			// Update the local project object with either the same or new values
			this.project.projectName =
				this.projectForm.value.projectName || this.project.projectName;
			this.project.description =
				this.projectForm.value.description || this.project.description;
			this.project.startDate =
				this.projectForm.value.dateRange?.start || this.project.startDate;
			this.project.targetDate =
				this.projectForm.value.dateRange?.end || this.project.targetDate;
			this.project.picName = this.currentPic().name || this.project.picName;
			console.log("Editing project. Submitting:", alterProject);
			console.log("Editing Origin project:", this.project);
			this.dataService.putAlterProject(alterProject).subscribe();
		} else {
			console.log("Edit form is invalid. Marking all as touched.");
			this.projectForm.markAllAsTouched();
		}
	}
}
