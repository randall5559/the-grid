/* tslint:disable:no-unused-variable */
import {
  async,
  ComponentFixture,
  TestBed,
  ComponentFixtureAutoDetect,
  inject,
  fakeAsync,
  tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement, ElementRef, Renderer, Component } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable, BehaviorSubject } from 'rxjs';
import {
  DataService,
  ActionsService,
  StateManagerService
} from '../../../services';
import { CommentsComponent } from './comments.component';
import { ModalService } from './../../../shared/components/modal/modal.service';
import { Modal } from './../../../interfaces/modal.interface';
import { Comment } from './../../../interfaces/comment.interface';

@Component({
  selector: 'ag-test-component-wrapper',
  template: '<div><ag-comments></ag-comments></div>'
})
class TestComponent {
  public testing: number = 123;
}

describe('CommentsComponent', () => {
  let dataService: DataService;
  let actionsService: ActionsService;
  let stateManager: StateManagerService;
  let modalService: ModalService;
  let component: CommentsComponent;
  let fixture: ComponentFixture<CommentsComponent>;
  let de: DebugElement;
  let el: HTMLElement;

  let userFakeProfile: any = {
    first_name: 'Fake',
    last_name: 'Name',
    permission: 'A lot'
  };

  let commentObj: any = {
    comments: [{
      created_at: '2017-03-06T16:23:47.000+00:00',
      text: 'Some Text',
      user: {
        app_user_id: 123,
        first_name: 'Fake',
        last_name: 'Name'
      }
    }],
    deal_id : 12345,
    id : 1
  };

  let newComment = {
    created_at: '2017-03-06T16:23:47.000+00:00',
    text: 'new comment',
    user: {
      app_user_id: 2,
      first_name: 'New',
      last_name: 'Name'
    }
  };

  class MockDataService {
    public saveComment(dealId, text) {
      return Observable.of('fake save observable');
    }

    public deleteComment(dealId, text) {
      return Observable.of('fake delete observable');
    }
  }

  class MockActionsService {
    public updateCommentValue(id, comments) {}

    public updateComments(comments: Comment[], id: number, dealId: number) {
      stateManager.update('CommentsModel')((state) : any => {
          return {
            id: id,
            deal_id: dealId,
            comments: comments
          };
      });
    }

    public resetDirtyAgencyFields() {}
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CommentsComponent],
      providers: [
        ModalService,
        StateManagerService,
        { provide: DataService, useClass: MockDataService },
        { provide: ActionsService, useClass: MockActionsService },
        { provide: ComponentFixtureAutoDetect, useValue: true }
      ]
    })
    .compileComponents();
  }));

  beforeEach(inject([DataService, ActionsService, StateManagerService, ModalService],
    (_DataService_, _ActionsService_, _StateManagerService_, _ModalService_) => {
    dataService = _DataService_;
    actionsService = _ActionsService_;
    stateManager = _StateManagerService_;
    modalService = _ModalService_;

    stateManager.createModel('UserProfile');
    stateManager.setModel('UserProfile', userFakeProfile);

    stateManager.createModel('CommentsModel');
    stateManager.setModel('CommentsModel', {});

    fixture = TestBed.createComponent(CommentsComponent);
    component = fixture.componentInstance;

    spyOn(actionsService, 'updateCommentValue').and.callThrough();
    spyOn(actionsService, 'resetDirtyAgencyFields').and.callThrough();
    spyOn(dataService, 'saveComment').and.callThrough();
    spyOn(dataService, 'deleteComment').and.callThrough();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('LifeCycle Hooks - (ngOnInit, ngAfterViewInit)', () => {
    it('ngOnInit', (done) => {
      actionsService.updateComments(commentObj.comments, commentObj.id, commentObj.deal_id);

      setTimeout(() => {
        commentObj.comments.push(newComment);
        actionsService.updateComments(commentObj.comments, commentObj.id, commentObj.deal_id);
        modalService.hide();
        expect(component.commentsInitLength).not.toEqual(commentObj.comments.length);
        expect(component.comments).toEqual(commentObj.comments);
        expect(actionsService.updateCommentValue).toHaveBeenCalledWith(component.commentId, component.comments);
        done();
      });
    });

    it('ngAfterViewInit', fakeAsync(() => {
      component.charLimit = 3;

      let elem = fixture.debugElement.query(By.css('#comment-text'));
      let keyupEvent = document.createEvent('CustomEvent');
      keyupEvent.initCustomEvent('keyup', false, false, null);

      elem.nativeElement.innerHTML = 'test';
      elem.nativeElement.dispatchEvent(keyupEvent);

      tick(501);
      expect(component.textLimit).toEqual(-1);
      expect(component.addElementRef.nativeElement.value).toEqual('tes');
    }));
  });

  describe('Custom Methods', () => {
    it('onAdd', (done) => {
      component.addElementRef.nativeElement.value = 'fake value';
      component.onAdd();

      setTimeout(() => {
        expect(component.comments[0].text).toEqual('fake value');
        expect(component.comments[0].user.first_name).toEqual('Fake');
        expect(component.comments[0].user.last_name).toEqual('Name');
        expect(component.charLimit).toEqual(2500);
        expect(component.addElementRef.nativeElement.value).toEqual('');
        expect(dataService.saveComment).toHaveBeenCalled();
        expect(actionsService.resetDirtyAgencyFields).toHaveBeenCalled();
        done();
      });
    });

    it('onDelete', () => {
      component.comments.push(newComment);
      component.onDelete(0, '1234');

      expect(component.comments.length).toEqual(0);
      expect(dataService.deleteComment).toHaveBeenCalledWith('1234', component.commentDealId);
      expect(actionsService.resetDirtyAgencyFields).toHaveBeenCalled();
    });
  });
});
