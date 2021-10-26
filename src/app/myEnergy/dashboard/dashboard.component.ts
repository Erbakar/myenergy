import { Component, AfterViewInit } from '@angular/core';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { environment } from '@env/environment';
import { MyenergyStartDialog } from '@app/shared/dialog/myenergy-start/myenergy-start.component';
import { MatDialog } from '@angular/material/dialog';
import { ApiRequestService, Method } from '@app/core/http/api-request.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MyenergyChallengesDialog } from '@app/shared/dialog/myenergy-challenges/myenergy-challenges.component';
import { MyenergyGoalsVideoDialog } from '@app/shared/dialog/myenergy-goals-video/myenergy-goals-video.component';
import { UserJourneyService } from '@app/myEnergy/dashboard/user-journey.service';
import { Router } from '@angular/router';

declare var $: any;
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements AfterViewInit {
  challengesForm: FormGroup;
  data;
  challengesData;
  storyblok;
  visitFirstShowModal = false;
  firstBoxActiveItem = null;
  infoChallenges = false;
  infoChallengesDone = false;
  infoPurchases = false;
  infoRecommendation = false;
  selectedChallenges;
  interval;
  moreOptions: OwlOptions = {
    loop: false,
    mouseDrag: true,
    touchDrag: true,
    slideBy: 1,
    pullDrag: true,
    dots: true,
    margin: 20,
    navSpeed: 700,
    rewind: false,
    navText: ['Previous', 'Next'],
    responsive: {
      0: {
        items: 1,
      },
    },
    nav: true,
  };
  labelsOptions: OwlOptions = {
    loop: false,
    mouseDrag: true,
    touchDrag: true,
    slideBy: 1,
    pullDrag: true,
    dots: false,
    margin: 20,
    navSpeed: 700,
    rewind: false,
    responsive: {
      0: {
        items: 4,
      },
    },
    nav: true,
  };
  climateOptions: OwlOptions = {
    loop: false,
    mouseDrag: true,
    touchDrag: true,
    slideBy: 1,
    pullDrag: true,
    dots: false,
    margin: 0,
    navSpeed: 700,
    rewind: false,
    responsive: {
      0: {
        items: 1,
      },
    },
    nav: true,
  };

  constructor(
    private dialog: MatDialog,
    public userJourneyService: UserJourneyService,
    private http: ApiRequestService,
    private router: Router,
    private formBuilder: FormBuilder
  ) {
    this.storyblok = JSON.parse(localStorage.getItem('storyblok'));
    this.challengesForm = this.formBuilder.group({
      resourceDepletion: [''],
      wasteGeneration: [''],
      climateChange: [''],
    });
    this.userJourneyService.userJourneyData.subscribe((res) => {
      this.data = res;
      if (!this.data.MYE_SEEN_WELCOME_MODAL) {
        this.openStartMyenergyModal();
      }
    });
  }
  async setFirstBoxActiveItem(item: number) {
    switch (item) {
      case 2:
        await this.userJourneyService.guindance('put', [
          { question: 'MYE_CLICKED_LEARN_CHALLENGES_VIDEO', value: true },
        ]);
        break;
      case 3:
        await this.userJourneyService.guindance('put', [
          { question: 'MYE_CLICKED_LEARN_PROCUREMENT_VIDEO', value: true },
        ]);
        break;
      default:
        break;
    }
    console.log(this.data);

    this.firstBoxActiveItem = item;
  }

  async hideProcurement() {
    await this.userJourneyService.guindance('put', [
      { question: 'MYE_CLOSED_WHY_PROCUREMENT_BOX', value: true },
    ]);
  }

  openStartMyenergyModal() {
    const dialogRef = this.dialog.open(MyenergyStartDialog, {
      width: '80%',
      maxWidth: '600px',
    });
    dialogRef.afterClosed().subscribe(async (result) => {
      if (!result) {
        return;
      }
      try {
        await this.userJourneyService.guindance('put', [
          { question: 'MYE_SEEN_WELCOME_MODAL', value: true },
        ]);
      } catch (error) {}
    });
  }

  async goToGoal() {
    await this.userJourneyService.guindance('put', [
      { question: 'MYE_CLICKED_CHOOSE_CHALLENGE', value: true },
    ]);
  }

  setGoal(item: any, type?: string) {
    this.challengesMyenergyModal(item, type);
  }

  getChallenges() {
    this.http
      .callService(
        new Method(
          environment.myEnergyServices.challenges(
            JSON.parse(sessionStorage.getItem('credentials')).organisation.id
          ),
          '',
          'get'
        )
      )
      .subscribe(async (res) => {
        this.challengesData = res;
        if (this.challengesData.resourceDepletion) {
          this.selectedChallenges = 'Resource depletion';
        }
        if (this.challengesData.wasteGeneration) {
          this.selectedChallenges = this.selectedChallenges
            ? this.selectedChallenges
            : '' + ' , Waste generation';
        }
        if (this.challengesData.climateChange) {
          this.selectedChallenges = this.selectedChallenges
            ? this.selectedChallenges
            : '' + ' , Climate change';
        }
      });
  }
  async getGuidance() {
    await this.userJourneyService.guindance('get');
  }

  challengesMyenergyModal(item: any, type?: string) {
    const dialogRef = this.dialog.open(MyenergyChallengesDialog, {
      width: '80%',
      maxWidth: '800px',
    });
    dialogRef.afterClosed().subscribe(async (result) => {
      if (!result) {
        return;
      }
      try {
        this.http
          .callService(
            new Method(
              environment.myEnergyServices.challenges(
                JSON.parse(sessionStorage.getItem('credentials')).organisation
                  .id
              ),
              item.value,
              'put'
            )
          )
          .subscribe(async (res) => {
            this.challengesData = res;
            if (this.challengesData.resourceDepletion) {
              this.selectedChallenges = 'Resource depletion';
            }
            if (this.challengesData.wasteGeneration) {
              this.selectedChallenges =
                this.selectedChallenges + ' , Waste generation';
            }
            if (this.challengesData.climateChange) {
              this.selectedChallenges =
                this.selectedChallenges + ' , Climate change';
            }
          });
        if (type) {
          this.router.navigate(['myenergy/purchases/', type]);
        }
      } catch (error) {}
    });
  }

  infoVideoModal(topic: any) {
    console.log(topic);

    const dialogRef = this.dialog.open(MyenergyGoalsVideoDialog, {
      width: '80%',
      maxWidth: '680px',
      data: {
        topic: topic,
        videoUrl:
          topic === 'tender'
            ? 'https://player.vimeo.com/video/402354283'
            : 'https://player.vimeo.com/video/168837403',
        Title:
          topic === 'tender'
            ? this.storyblok.myenergy_dashboard_purchases_left_modal_title
            : this.storyblok.myenergy_dashboard_purchases_right_modal_title,
        Desc:
          topic === 'tender'
            ? this.storyblok.myenergy_dashboard_purchases_left_modal_desc
            : this.storyblok.myenergy_dashboard_purchases_right_modal_desc,
        Button1:
          topic === 'tender'
            ? this.storyblok.myenergy_dashboard_purchases_left_modal_button1
            : this.storyblok.myenergy_dashboard_purchases_right_modal_button1,
        Button2:
          topic === 'tender'
            ? this.storyblok.myenergy_dashboard_purchases_left_modal_button2
            : this.storyblok.myenergy_dashboard_purchases_right_modal_button2,
        DontShowText: this.storyblok.Dont_Show_Text,
      },
    });
    dialogRef.afterClosed().subscribe(async (result) => {
      if (!result) {
        return;
      }
      try {
        if (result.neverShow) {
          if (topic === 'tender') {
            await this.userJourneyService.guindance('put', [
              { question: 'MYE_HIDE_TENDER_PROCUREMENT_VIDEO', value: true },
            ]);
          }
          if (topic === 'direct') {
            await this.userJourneyService.guindance('put', [
              { question: 'MYE_HIDE_DIRECT_PROCUREMENT_VIDEO', value: true },
            ]);
          }
        }
      } catch (error) {}
    });
  }

  ngAfterViewInit(): void {
    // this.getChallenges();
    this.getGuidance();
  }
}
