import {
  Component, Input, OnInit, OnDestroy, ElementRef, Output,  EventEmitter
} from '@angular/core';

@Component({
  selector: 'countdown-timer',
  template: `{{ displayTime }}`
})
export class CountdownTimer implements OnInit, OnDestroy {
  @Input() start;
  @Input() end;
  @Input() hours = true;
  @Input() minutes = true;
  @Input() seconds = true;
  @Output() zeroTrigger;
  @Input() timeOnly;
  timer: any;
  displayTime: any;
  constructor(
    private el: ElementRef
  ) {
    this.zeroTrigger = new EventEmitter(true);
  }

  ngOnInit(): void {
    this.timer = setInterval(() => {
      if (this.start) {
          this.displayTime = this.getTimeDiff(this.start, true);
      } else {
          this.displayTime = this.getTimeDiff(this.end);
      }
    }, 1000);
  }

  ngOnDestroy() {
    this.stopTimer();
  }

  private getTimeDiff( datetime, useAsTimer = false ) {
    datetime = new Date( datetime ).getTime();
    var now = new Date().getTime();

    if (isNaN(datetime)) { return ''; }

    var milisec_diff = datetime - now;
    if (useAsTimer) { milisec_diff = now - datetime; }

    // Zero Time Trigger
    if (milisec_diff <= 0) {
      this.zeroTrigger.emit('reached zero');
      return '00:00';
    }

    var days = Math.floor(milisec_diff / 1000 / 60 / (60 * 24));
    var date_diff = new Date( milisec_diff );
    var day_string = (days) ? this.twoDigit(days) + ':' : '';
    var day_hours = days * 24;
    var timeString = '';

    if (!this.timeOnly) {
      timeString = day_string + ' ';
    }

    if (this.hours) {
      var hours = date_diff.getUTCHours() + day_hours;
      timeString = timeString + this.twoDigit(hours);
    }

    if (this.minutes) {
      var minutes = date_diff.getMinutes();
      timeString = timeString + ':' + this.twoDigit(minutes);
    }

    if (this.seconds) {
      var seconds = date_diff.getSeconds();
      timeString = timeString + ':' + this.twoDigit(seconds);
    }

    return timeString;
  }

  private twoDigit(number: number) {
    return number > 9 ? '' + number: '0' + number;
  }

  private stopTimer() {
    clearInterval(this.timer);
    this.timer = undefined;
  }
}
