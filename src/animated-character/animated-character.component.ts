// import {
//   Component,
//   OnInit,
//   AfterViewInit,
//   ElementRef,
//   ViewChild,
//   Renderer2,
//   OnDestroy,
//   Input
// } from '@angular/core';
// import { gsap } from 'gsap';
// import { ScrollTrigger } from 'gsap/ScrollTrigger';
// import { CommonModule } from '@angular/common';
// @Component({
//   selector: 'app-animated-character',
//   imports: [CommonModule],
//   template: `
//   <div class="animation-container" [ngClass]="overFlow">
//     <!-- <div #imageContainer class="image-container"></div> -->
//     <div #imageContainer class="relative overflow-hidden"></div>
// </div>`,
//   // templateUrl: './animated-character.component.html',
//   styleUrl: './animated-character.component.scss'
// })
// export class AnimatedCharacterComponent implements OnInit, AfterViewInit, OnDestroy {
//   @ViewChild('imageContainer', { static: true }) imageContainer!: ElementRef;

//   @Input() componentId: string = 'default';
//   @Input() overFlow: string = 'overflow-visible';
//   @Input() totalFrames = 57;
//   @Input() currentFrame = 0;
//   @Input() frameWidth = 400;
//   @Input() frameHeight = 400;
//   @Input() framesPerRow = 5;
//   @Input() imageUrl: string = '';
//   @Input() spriteWidth: number = 3302;
//   @Input() spriteHeight: number = 4834;
//   currentImageUrl: string = '/website materials/products images/use this/ezgif-2d2d592b3c242f.png';
//   showText = 0
//   lastfram!: number

//   private scrollTrigger!: ScrollTrigger;
//   private animationFrameId: number | null = null;
//   private framePositions: { x: number; y: number }[] = [];

//   constructor(private renderer: Renderer2) {
//     gsap.registerPlugin(ScrollTrigger);
//   }

//   ngOnChanges() {
//     if (this.initialized) {
//       this.setupFrames();
//     }
//   }

//   ngOnInit(): void { }

//   private initialized = false;

//   ngAfterViewInit(): void {
//     if (this.initialized) return;
//     this.initialized = true;

//     const container = this.imageContainer?.nativeElement;
//     if (container) {
//       this.renderer.setStyle(container, 'width', `${this.frameWidth}px`);
//       this.renderer.setStyle(container, 'height', `${this.frameHeight}px`);
//     }

//     this.renderer.removeClass(this.imageContainer.nativeElement.parentElement, 'visible');
//     this.precalculateFramePositions();
//     this.setupFrames();
//     this.setupScrollAnimation();
//   }

//   ngOnDestroy(): void {
//     this.scrollTrigger?.kill();
//     if (this.animationFrameId) {
//       cancelAnimationFrame(this.animationFrameId);
//     }
//   }

//   private precalculateFramePositions(): void {
//     this.framePositions = [];
//     for (let i = 1; i <= this.totalFrames; i++) {
//       const index = i - 1;
//       const row = Math.floor(index / this.framesPerRow);
//       const col = index % this.framesPerRow;
//       const posX = -col * this.frameWidth;
//       const posY = -row * this.frameHeight;
//       this.framePositions.push({ x: posX, y: posY });
//     }
//   }

//   changeImageUrl(newUrl: string) {
//     this.currentImageUrl = newUrl;
//   }

//   public updateFrameFromScroll(progress: number) {
//     const frameIndex = Math.floor(progress * (this.totalFrames - 1)) + 1;
//     this.showFrame(frameIndex);
//   }

//   setupFrames() {
//     const container = this.imageContainer.nativeElement;
//     container.innerHTML = '';

//     const frame = this.renderer.createElement('div');
//     this.renderer.addClass(frame, 'sprite-frame');

//     this.renderer.setStyle(frame, 'width', `${this.frameWidth}px`);
//     this.renderer.setStyle(frame, 'height', `${this.frameHeight}px`);
//     this.renderer.setStyle(frame, 'background-image', `url('${this.imageUrl}')`);
//     this.renderer.setStyle(frame, 'background-size', `${this.spriteWidth}px ${this.spriteHeight}px`);

//     this.renderer.appendChild(container, frame);
//   }

//   setupScrollAnimation() {
//     const container = this.imageContainer.nativeElement;
//     let played = false;
//     let animationInterval: any = null;
//   }

//   isPlayingForward = false;
//   isPlayingReverse = false;

//   showFrame(frameNumber: number) {
//     const frame = this.imageContainer.nativeElement.querySelector('.sprite-frame');
//     if (!frame) return;

//     frameNumber = Math.max(1, Math.min(frameNumber, this.totalFrames));
//     const position = this.framePositions[frameNumber - 1];

//     if (position) {
//       this.renderer.setStyle(frame, 'background-position', `${position.x}px ${position.y}px`);
//     }
//     if (position) {
//       console.log('Showing frame:', frameNumber, 'Position:', position);
//       this.renderer.setStyle(frame, 'background-position', `${position.x}px ${position.y}px`);
//     }
//   }

//   // playForwardAnimation(): Promise<void> {
//   //   this.renderer.addClass(this.imageContainer.nativeElement.parentElement, 'visible');
//   //   let currentFrame = 1;
//   //   const frameDuration = 70; // Reduced from 35ms for smoother animation

//   //   this.isPlayingForward = true;
//   //   this.isPlayingReverse = false;

//   //   return new Promise((resolve) => {
//   //     let lastTime = performance.now();

//   //     const animate = (time: number) => {
//   //       if (!this.isPlayingForward) {
//   //         resolve();
//   //         return;
//   //       }

//   //       if (time - lastTime >= frameDuration) {
//   //         this.showFrame(currentFrame);
//   //         currentFrame++;
//   //         lastTime = time;
//   //       }

//   //       if (currentFrame <= this.totalFrames) {
//   //         this.animationFrameId = requestAnimationFrame(animate);
//   //       } else {
//   //         this.showFrame(this.totalFrames);
//   //         this.isPlayingForward = false;
//   //         resolve();
//   //       }
//   //     };

//   //     this.animationFrameId = requestAnimationFrame(animate);
//   //   });
//   // }
//   playForwardAnimation(fps: number = 24): Promise<void> {
//     this.renderer.addClass(this.imageContainer.nativeElement.parentElement, 'visible');

//     let currentFrame = 1;
//     const frameDuration = 1000 / fps;

//     this.isPlayingForward = true;
//     this.isPlayingReverse = false;

//     return new Promise((resolve) => {
//       let lastTime = performance.now();

//       const animate = (time: number) => {
//         if (!this.isPlayingForward) {
//           resolve();
//           return;
//         }

//         if (time - lastTime >= frameDuration) {
//           this.showFrame(currentFrame);
//           currentFrame++;
//           lastTime = time;
//         }

//         if (currentFrame <= this.totalFrames) {
//           this.animationFrameId = requestAnimationFrame(animate);
//         } else {
//           this.showFrame(this.totalFrames);
//           this.isPlayingForward = false;
//           resolve();
//         }
//       };

//       this.animationFrameId = requestAnimationFrame(animate);
//     });
//   }

//   playReverseAnimation() {
//     let currentFrame = this.totalFrames;
//     this.isPlayingForward = false;
//     this.isPlayingReverse = true;

//     const animate = () => {
//       if (!this.isPlayingReverse) return;

//       this.showFrame(currentFrame);
//       currentFrame--;

//       if (currentFrame >= 1) {
//         setTimeout(animate, 30); // Reduced from 40ms
//       } else {
//         this.showFrame(1);
//         this.isPlayingReverse = false;
//       }
//     };

//     animate();
//   }
//   hideproduct() {
//     this.renderer.removeClass(this.imageContainer.nativeElement.parentElement, 'visible');
//   }

//   showproduct() {
//     this.renderer.addClass(this.imageContainer.nativeElement.parentElement, 'visible');
//   }
// }

import {
  Component,
  OnInit,
  AfterViewInit,
  ElementRef,
  ViewChild,
  Renderer2,
  OnDestroy,
  Input
} from '@angular/core';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-animated-character',
  imports: [CommonModule],
  template: `
  <div class="animation-container" [ngClass]="overFlow">
    <!-- <div #imageContainer class="image-container"></div> -->
    <div #imageContainer class="relative overflow-hidden"></div>
</div>`,
  // templateUrl: './animated-character.component.html',
  styleUrl: './animated-character.component.scss'
})
export class AnimatedCharacterComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('imageContainer', { static: true }) imageContainer!: ElementRef;

  @Input() componentId: string = 'default';
  @Input() overFlow: string = 'overflow-visible';
  @Input() totalFrames = 57;
  @Input() currentFrame = 0;
  @Input() frameWidth = 400;
  @Input() frameHeight = 400;
  @Input() framesPerRow = 5;
  @Input() imageUrl: string = '';
  @Input() spriteWidth: number = 3302;
  @Input() spriteHeight: number = 4834;
  currentImageUrl: string = '/website materials/products images/use this/ezgif-2d2d592b3c242f.png';
  showText = 0
  lastfram!: number

  private scrollTrigger!: ScrollTrigger;
  private animationFrameId: number | null = null;
  private framePositions: { x: number; y: number }[] = [];

  constructor(private renderer: Renderer2) {
    gsap.registerPlugin(ScrollTrigger);
  }

  ngOnChanges() {
    if (this.initialized) {
      this.setupFrames();
    }
  }

  ngOnInit(): void { }

  private initialized = false;

  ngAfterViewInit(): void {
    if (this.initialized) return;
    this.initialized = true;

    const container = this.imageContainer?.nativeElement;
    if (container) {
      this.renderer.setStyle(container, 'width', `${this.frameWidth}px`);
      this.renderer.setStyle(container, 'height', `${this.frameHeight}px`);
    }

    this.renderer.removeClass(this.imageContainer.nativeElement.parentElement, 'visible');
    this.precalculateFramePositions();
    this.setupFrames();
    this.setupScrollAnimation();
  }

  ngOnDestroy(): void {
    this.scrollTrigger?.kill();
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
  }

  private precalculateFramePositions(): void {
    this.framePositions = [];
    for (let i = 1; i <= this.totalFrames; i++) {
      const index = i - 1;
      const row = Math.floor(index / this.framesPerRow);
      const col = index % this.framesPerRow;
      const posX = -col * this.frameWidth;
      const posY = -row * this.frameHeight;
      this.framePositions.push({ x: posX, y: posY });
    }
  }

  changeImageUrl(newUrl: string) {
    this.currentImageUrl = newUrl;
  }

  public updateFrameFromScroll(progress: number) {
    const frameIndex = Math.floor(progress * (this.totalFrames - 1)) + 1;
    this.showFrame(frameIndex);
  }

  setupFrames() {
    const container = this.imageContainer.nativeElement;
    container.innerHTML = '';

    const frame = this.renderer.createElement('div');
    this.renderer.addClass(frame, 'sprite-frame');

    this.renderer.setStyle(frame, 'width', `${this.frameWidth}px`);
    this.renderer.setStyle(frame, 'height', `${this.frameHeight}px`);
    this.renderer.setStyle(frame, 'background-image', `url('${this.imageUrl}')`);
    this.renderer.setStyle(frame, 'background-size', `${this.spriteWidth}px ${this.spriteHeight}px`);

    this.renderer.appendChild(container, frame);
  }

  setupScrollAnimation() {
    const container = this.imageContainer.nativeElement;
    let played = false;
    let animationInterval: any = null;
  }

  isPlayingForward = false;
  isPlayingReverse = false;

  showFrame(frameNumber: number) {
    const frame = this.imageContainer.nativeElement.querySelector('.sprite-frame');
    if (!frame) return;

    frameNumber = Math.max(1, Math.min(frameNumber, this.totalFrames));
    const position = this.framePositions[frameNumber - 1];

    if (position) {
      this.renderer.setStyle(frame, 'background-position', `${position.x}px ${position.y}px`);
    }
    if (position) {
      console.log('Showing frame:', frameNumber, 'Position:', position);
      this.renderer.setStyle(frame, 'background-position', `${position.x}px ${position.y}px`);
    }
  }

  // playForwardAnimation(): Promise<void> {
  //   this.renderer.addClass(this.imageContainer.nativeElement.parentElement, 'visible');
  //   let currentFrame = 1;
  //   const frameDuration = 70; // Reduced from 35ms for smoother animation

  //   this.isPlayingForward = true;
  //   this.isPlayingReverse = false;

  //   return new Promise((resolve) => {
  //     let lastTime = performance.now();

  //     const animate = (time: number) => {
  //       if (!this.isPlayingForward) {
  //         resolve();
  //         return;
  //       }

  //       if (time - lastTime >= frameDuration) {
  //         this.showFrame(currentFrame);
  //         currentFrame++;
  //         lastTime = time;
  //       }

  //       if (currentFrame <= this.totalFrames) {
  //         this.animationFrameId = requestAnimationFrame(animate);
  //       } else {
  //         this.showFrame(this.totalFrames);
  //         this.isPlayingForward = false;
  //         resolve();
  //       }
  //     };

  //     this.animationFrameId = requestAnimationFrame(animate);
  //   });
  // }
  playForwardAnimation(fps: number = 24): Promise<void> {
    this.renderer.addClass(this.imageContainer.nativeElement.parentElement, 'visible');

    let currentFrame = 1;
    const frameDuration = 1000 / fps;

    this.isPlayingForward = true;
    this.isPlayingReverse = false;

    return new Promise((resolve) => {
      let lastTime = performance.now();

      const animate = (time: number) => {
        if (!this.isPlayingForward) {
          resolve();
          return;
        }

        if (time - lastTime >= frameDuration) {
          this.showFrame(currentFrame);
          currentFrame++;
          lastTime = time;
        }

        if (currentFrame <= this.totalFrames) {
          this.animationFrameId = requestAnimationFrame(animate);
        } else {
          this.showFrame(this.totalFrames);
          this.isPlayingForward = false;
          resolve();
        }
      };

      this.animationFrameId = requestAnimationFrame(animate);
    });
  }

  playReverseAnimation() {
    let currentFrame = this.totalFrames;
    this.isPlayingForward = false;
    this.isPlayingReverse = true;

    const animate = () => {
      if (!this.isPlayingReverse) return;

      this.showFrame(currentFrame);
      currentFrame--;

      if (currentFrame >= 1) {
        setTimeout(animate, 30); // Reduced from 40ms
      } else {
        this.showFrame(1);
        this.isPlayingReverse = false;
      }
    };

    animate();
  }
  hideproduct() {
    this.renderer.removeClass(this.imageContainer.nativeElement.parentElement, 'visible');
  }

  showproduct() {
    this.renderer.addClass(this.imageContainer.nativeElement.parentElement, 'visible');
  }

  shouldStop = false; // أضف هذا المتغير في الكلاس (تتحكم فيه من بره)

  // دالة تعديل لتشغيل الرسوم المتحركة بفريمات أسرع وبشكل متكرر
  playForwardLoop(fps: number = 24): void {
    this.renderer.addClass(this.imageContainer.nativeElement.parentElement, 'visible');

    let currentFrame = 1;
    const frameDuration = 1000 / fps;

    this.isPlayingForward = true;
    this.isPlayingReverse = false;
    this.shouldStop = false; // reset before play

    const loop = (time: number) => {
      if (!this.isPlayingForward) return;

      if (time - lastTime >= frameDuration) {
        this.showFrame(currentFrame);
        currentFrame++;
        lastTime = time;
      }

      if (currentFrame > this.totalFrames) {
        if (this.shouldStop) {
          this.showFrame(this.totalFrames);
          this.isPlayingForward = false;
          return;
        } else {
          currentFrame = 1; // reset to loop
        }
      }

      this.animationFrameId = requestAnimationFrame(loop);
    };

    let lastTime = performance.now();
    this.animationFrameId = requestAnimationFrame(loop);
  }

}
