import { Component, ViewChildren, QueryList, Renderer2, ElementRef, ViewChild, AfterViewInit, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import * as THREE from 'three';
import SplitText from 'gsap/SplitText';
import { TextPlugin } from 'gsap/TextPlugin';
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin';
import Observer from 'gsap/Observer'
import PixiPlugin from 'gsap/PixiPlugin'
import ScrambleTextPlugin from 'gsap/ScrambleTextPlugin'
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit  {
/////////////////////////////////////////////////Declarations /////////////////////////////////////////////////////////////
  @ViewChild('sectionRef') sectionRef!: ElementRef;
  @ViewChild('lampRef') lampRef!: ElementRef;
  @ViewChild('textRef') textRef!: ElementRef;
  @ViewChild('spaceText') spaceText!: ElementRef;
  @ViewChild('section1image') section1image!: ElementRef;
  isOn = false;
  animationCompleted = false;
  fullText = 'More Than galaxies';
  characters2: string[] = [];
  private section4Timeline!: GSAPTimeline;
  videoid: number = -1;
  splitText!: SplitText;
  appreadstatus: number = 1
  @ViewChildren('charSpan2') charSpans!: QueryList<ElementRef>;
///////////////////////////////////////////////// constructor and  ngAfterViewInit/////////////////////////////////////////////////////////////
  constructor(private renderer: Renderer2) {}
  ngOnInit(): void {
    this.characters2 = this.fullText.split('');
  }
  ngAfterViewInit(): void {
    
gsap.registerPlugin(ScrollTrigger,TextPlugin,DrawSVGPlugin,SplitText,PixiPlugin,ScrambleTextPlugin);
    this.initializeSpaceText();
    gsap.set(this.lampRef.nativeElement,
      { x: -1000, autoAlpha: 0 })
      this.characters2 = this.fullText.split('');
      this.imagescroller()
      this.initScene();
      this.loadTexturesAndCreateSphere();
      this.addEventListeners();
      this.animate();
    this.drawSVG();
  }
/////////////////////////////////////////////////section 1 /////////////////////////////////////////////////////////////
  toggleButton() {
    this.isOn = !this.isOn;
if(this.isOn){
  gsap.set(this.lampRef.nativeElement,
    { x: -1000, autoAlpha: 0 })
  this.playInitialAnimation();
}else{
  gsap.set(this.lampRef.nativeElement,
    {  autoAlpha: 0 })

}
  }

  initializeSpaceText() {
    gsap.set(this.spaceText.nativeElement, {
      opacity: 0,
      color: 'transparent'
    });
  }
  playInitialAnimation() {
    const lamp = this.lampRef.nativeElement;
    const image = this.section1image.nativeElement;
    gsap.fromTo(lamp,
      { x: -1500, autoAlpha: 0.2 },
      {
        x: 1100,
        autoAlpha: 1,
        duration: 3.5,
        ease: 'power2.inOut',
        onStart:()=>{
          gsap.to(this.sectionRef.nativeElement, {
            backgroundColor: 'rgba(0,0,0,0)',
            duration: 0.7,
            delay:1.5,
            ease: 'NONE'
          });
        },
        onUpdate:()=>{
          this.checkLampTextOverlap()
        },
        onComplete: () => {
          this.animationCompleted = true;
          this.enableMouseFollow();
            gsap.to(lamp,{
              x:-20
            })
        }
      }
    );
  }
  enableMouseFollow() {
    const lamp = this.lampRef.nativeElement;
    gsap.killTweensOf(lamp);
    
    window.addEventListener('mousemove', (e) => {
      this.renderer.setStyle(lamp, 'left', `${e.clientX}px`);
      this.checkLampTextOverlap();
    });
  }

  checkLampTextOverlap() {
    const lampRect = this.lampRef.nativeElement.getBoundingClientRect();
    const spaceTextRect = this.spaceText.nativeElement.getBoundingClientRect();
    const lampCenterX = lampRect.left + lampRect.width / 2;
    const isOverSpace = lampCenterX >= spaceTextRect.left && 
                       lampCenterX <= spaceTextRect.right &&
                       lampRect.top <= spaceTextRect.bottom && 
                       lampRect.bottom >= spaceTextRect.top;
    if (isOverSpace &&this.isOn) {
      gsap.to(this.spaceText.nativeElement, {
        opacity: 1,
        color: '#1890ff',
        textShadow: '0 0 10px #40a9ff',
        duration: 0.2
      });
    } else {
      gsap.to(this.spaceText.nativeElement, {
        opacity: 0,
        color: 'transparent',
        duration: 0.3
      });
    }
  }

/////////////////////////////////////////////////section 2 /////////////////////////////////////////////////////////////

imagescroller(): void {
  const images = Array.from(document.querySelectorAll('img'));
  const loader = document.querySelector('.loader--text') as HTMLElement;

  const showDemo = () => {
    gsap.utils.toArray<HTMLElement>('section').forEach((section, index) => {
      const wrapper = section.querySelector('.wrapper') as HTMLElement;
      if (!wrapper) return;

      const [x, xEnd] =
        index % 2 === 0
          ? [wrapper.scrollWidth * -1, 0]
          : ['100%', (wrapper.scrollWidth - section.offsetWidth) * -1];

      gsap.fromTo(
        wrapper,
        { x },
        {
          x: xEnd,
          scrollTrigger: {
            trigger: section,
            scrub: 0.5,
          },
        }
      );
    });
  };

  showDemo(); 
}
/////////////////////////////////////////////////section 3 /////////////////////////////////////////////////////////////

@ViewChild('container3D', { static: true }) container3D!: ElementRef;
private scene!: THREE.Scene;
private camera!: THREE.PerspectiveCamera;
private sphere!: THREE.Mesh;
private backgroundSphere!: THREE.Mesh;
private threeRenderer!: THREE.WebGLRenderer;
private animationFrameId: number | null = null;
private textures: THREE.Texture[] = [];
private texts: string[] = [
  'Mercury', 'Venus', 'Earth', 'Jupiter','Pluto'
];
public currentText = this.texts[0];
private currentTextureIndex = 0;
private mouseDown = false;
private lastMouseX = 0;

private initScene(): void {
  const container = this.container3D.nativeElement;
  const width = container.clientWidth;
  const height = container.clientHeight;
  
  this.scene = new THREE.Scene();
  
  this.camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
  this.camera.position.z = 5;
  
  this.threeRenderer = new THREE.WebGLRenderer({ 
    alpha: true, 
    antialias: true,
    powerPreference: "high-performance"
  });
  this.threeRenderer.setSize(width, height);
  this.threeRenderer.outputColorSpace = THREE.SRGBColorSpace;
  
  container.appendChild(this.threeRenderer.domElement);
  

  this.createStarfield();
  

  const ambientLight = new THREE.AmbientLight(0xffffff, 1.0);
  this.scene.add(ambientLight);
}

private createStarfield(): void {
  const starsGeometry = new THREE.BufferGeometry();
  const starsMaterial = new THREE.PointsMaterial({ 
    color: 0xffffff, 
    size: 2,
    sizeAttenuation: true
  });

  const starsVertices = [];
  for (let i = 0; i < 10000; i++) {
    const x = (Math.random() - 0.5) * 2000;
    const y = (Math.random() - 0.5) * 2000;
    const z = (Math.random() - 0.5) * 2000;
    starsVertices.push(x, y, z);
  }

  starsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starsVertices, 3));
  const starField = new THREE.Points(starsGeometry, starsMaterial);
  this.scene.add(starField);
}

private loadTexturesAndCreateSphere(): void {
  const loader = new THREE.TextureLoader();
  const imagePaths = [
    './space/murcury.png',
    './space/venus.png', 
    './space/Earth-PNG-Transparent-Picture.png',
    './space/jupiter.png',
    './space/Pluto-Planet-PNG.png',
  ];
  
  this.textures = imagePaths.map(path => {
    const texture = loader.load(path, 
      () => console.log(`Loaded texture: ${path}`),
      undefined,
      (error) => console.error(`Failed to load texture: ${path}`, error)
    );
    

    texture.colorSpace = THREE.SRGBColorSpace;
    texture.wrapS = THREE.ClampToEdgeWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.generateMipmaps = false;
    texture.flipY = false;
    
    return texture;
  });
  
  const geometry = new THREE.SphereGeometry(2, 64, 64);
  

  const baseMaterial = new THREE.MeshBasicMaterial({ 
    color: 0xffffff 
  });
  
  this.sphere = new THREE.Mesh(geometry, baseMaterial);
  this.scene.add(this.sphere);
  this.scene.add(this.sphere);

  this.applyTextureToSphere(0);
}

private getPlanetBaseColor(index: number): number {
  const colors = [
    0x8C7853, 
    0xFFC649, 
    0x4F94CD, 
    0xD2691E  
  ];
  return colors[index] || 0x555555;
}

private applyTextureToSphere(index: number): void {
  if (!this.textures[index]) return;
  
  const material = this.sphere.material as THREE.MeshBasicMaterial;
  const texture = this.textures[index];
  

  material.map = texture;
  material.color.setHex(0xffffff);
  material.needsUpdate = true;
}

private onMouseDown = (e: MouseEvent) => {
  this.mouseDown = true;
  this.lastMouseX = e.clientX;
  document.body.style.cursor = 'grabbing';
};

private onMouseUp = () => {
  this.mouseDown = false;
  document.body.style.cursor = 'grab';
};

private onMouseMove = (e: MouseEvent) => {
  if (!this.mouseDown) return;
  
  const deltaX = e.clientX - this.lastMouseX;
  this.sphere.rotation.y += deltaX * 0.008;
  this.lastMouseX = e.clientX;
  
  this.updateTextureByRotation();
};

private addEventListeners(): void {
  const canvas = this.threeRenderer.domElement;
  canvas.style.cursor = 'grab';
  
  canvas.addEventListener('mousedown', this.onMouseDown);
  window.addEventListener('mouseup', this.onMouseUp);
  window.addEventListener('mousemove', this.onMouseMove);
  window.addEventListener('resize', this.onWindowResize);
  

  canvas.addEventListener('touchstart', this.onTouchStart);
  canvas.addEventListener('touchmove', this.onTouchMove);
  canvas.addEventListener('touchend', this.onTouchEnd);
}

private onWindowResize = (): void => {
  const container = this.container3D.nativeElement;
  const width = container.clientWidth;
  const height = container.clientHeight;
  
  this.camera.aspect = width / height;
  this.camera.updateProjectionMatrix();
  this.threeRenderer.setSize(width, height);
};

private onTouchStart = (e: TouchEvent) => {
  e.preventDefault();
  this.mouseDown = true;
  this.lastMouseX = e.touches[0].clientX;
};

private onTouchMove = (e: TouchEvent) => {
  if (!this.mouseDown) return;
  e.preventDefault();
  
  const deltaX = e.touches[0].clientX - this.lastMouseX;
  this.sphere.rotation.y += deltaX * 0.008;
  this.lastMouseX = e.touches[0].clientX;
  
  this.updateTextureByRotation();
};

private onTouchEnd = (e: TouchEvent) => {
  e.preventDefault();
  this.mouseDown = false;
};

private updateTextureByRotation(): void {
  const totalSegments = this.textures.length;
  const fullRotation = Math.PI * 2;
  const segmentSize = fullRotation / totalSegments;
  
  const currentRotation = (this.sphere.rotation.y % fullRotation + fullRotation) % fullRotation;
  const newIndex = Math.floor(currentRotation / segmentSize) % totalSegments;
  
  if (newIndex !== this.currentTextureIndex) {
    this.currentTextureIndex = newIndex;
    this.applyTextureToSphere(newIndex);
    this.currentText = this.texts[newIndex] || 'Unknown Planet';
  }
}

private animate = (): void => {
  this.animationFrameId = requestAnimationFrame(this.animate);
  

  if (!this.mouseDown) {
    this.sphere.rotation.y += 0.002;
    this.updateTextureByRotation();
  }
  
  this.threeRenderer.render(this.scene, this.camera);
};

private createMultiPlanetScene(): void {
  const planetData = [
    { name: 'Mercury', texture: './space/murcury.png', position: { x: -8, y: 0, z: 0 } },
    { name: 'Venus', texture: './space/venus.png', position: { x: -3, y: 0, z: 0 } },
    { name: 'Earth', texture: './space/Earth-PNG-Transparent-Picture.png', position: { x: 2, y: 0, z: 0 } },
    { name: 'Jupiter', texture: './space/jupiter.png', position: { x: 7, y: 0, z: 0 } }
  ];

  const loader = new THREE.TextureLoader();
  
  planetData.forEach((planet, index) => {
    const geometry = new THREE.SphereGeometry(1.5, 32, 32);

    const material = new THREE.MeshBasicMaterial({ color: 0xffffff });
    
    const planetMesh = new THREE.Mesh(geometry, material);
    planetMesh.position.set(planet.position.x, planet.position.y, planet.position.z);

    loader.load(planet.texture, (texture) => {
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.wrapS = THREE.ClampToEdgeWrapping;
      texture.wrapT = THREE.ClampToEdgeWrapping;
      material.map = texture;
      material.needsUpdate = true;
    });
    
    this.scene.add(planetMesh);
  });

}
////////////////////////////////////////////////////////////////////////////////////////////////////
drawSVG(){
  gsap.set("#circle", {
    drawSVG: '100% 100%'
  });
  const textspace1 = new SplitText('.text-space1', {
    type: 'chars',
    charsClass: 'char',
    position: 'relative'
  });

  const existingTrigger = ScrollTrigger.getById('section4Trigger');
  if (existingTrigger) {
    existingTrigger.kill(true);
  }
  if (this.section4Timeline) {
    this.section4Timeline.kill();
  }

  this.section4Timeline = gsap.timeline({
    id: 'section4TL',
    scrollTrigger: {
      id: 'section4Trigger',
      trigger: '#section4',
      start: 'top top',
      end: '+=3500',
      scrub: true,
      pin: true,

    },
  });
  this.section4Timeline.fromTo(
    '#section4Text',
    { opacity: 0, yPercent: 700, filter: 'blur(20px)', visibility: 'hidden' },
    { opacity: 1, yPercent: 0, filter: 'blur(0px)', visibility: 'visible', duration: 0.7, ease: 'power2.inOut' }
  );
  
  this.section4Timeline.fromTo(
    '#circle',
    { drawSVG: '100% 100%' },
    { drawSVG: '65% 100%', duration: 1, onStart: () => { this.videoid = 0 } },
  );
  
  this.section4Timeline.fromTo(
    '#section4Text2',
    { opacity: 0, yPercent: 700, filter: 'blur(20px)', visibility: 'hidden' },
    { opacity: 1, yPercent: 0, filter: 'blur(0px)', visibility: 'visible', duration: 0.7, ease: 'power2.inOut' }
  );

  this.section4Timeline.fromTo(
    '#circle',
    { drawSVG: '65% 100%' },
    { drawSVG: '30% 100%', duration: 1 }
  );
  
  this.section4Timeline.fromTo(
    '#section4Text',
    { opacity: 1, yPercent: 0, filter: 'blur(0px)' },
    { opacity: 0, yPercent: -300, filter: 'blur(20px)', ease: 'power2.inOut', duration: 1 }
  );
  
  this.section4Timeline.fromTo(
    '#section4Text2',
    { opacity: 1, yPercent: 0, filter: 'blur(0px)' },
    { opacity: 0, yPercent: -300, filter: 'blur(20px)', ease: 'power2.inOut', duration: 0.5, onStart: () => { this.videoid = 0 } }
  );

  this.section4Timeline.fromTo(
    '#circle',
    { drawSVG: '30% 100%' },
    { drawSVG: '0% 100%', duration: 1 }
  )
  this.section4Timeline.to(
    '#circle',
    { autoAlpha:0 }
  )
  this.section4Timeline.to(".circlemask",{
    scale:2,
    z:350,

    transformOrigin:"center center",
    ease:"power1.inOut"
  },'>')
// .fromTo("#circle",{
//     attr: { r: 300 } },
//    { attr: { r: 400, cy: 306}
// },"<0.07")
this.section4Timeline.to(".space-01",{
    scale:1.2,
        transformOrigin:"center center",
    ease:"power1.inOut"


  },"<")


  this.section4Timeline.from('.text-space1 .char', {
    duration: 2,
    opacity:0,
    y: 100,
    stagger: 0.05,
    scrambleText: {
      text: 'x',
      chars: 'lowerCase',
      speed: 0.3,
      delimiter: ' ',
      tweenLength: false
    }
      ,
    ease: 'expo'
  });
  const textspace2 = new SplitText('.text-space2', {
    type: 'chars',
    charsClass: 'char',
    position: 'relative'
  });
  gsap.from('.text-space2 .char', {
    duration: 2,
    opacity:0,
    y: -100,
    stagger: 0.05,
    scrollTrigger:{
      trigger: '#space-02',
      start: '400% top',
      end: '600% bottom',
      scrub: true,
      markers:true
    },
    scrambleText: {
      text: 'x',
      chars: 'XO',
      speed: 0.3,
      delimiter: ' ',
      tweenLength: false
    },
    ease: 'expo'
  })
  const textspace3 = new SplitText('.text-space3', {
   type: "chars, words, lines",
   mask: "lines"
  });
  gsap.from(textspace3.chars, {
    yPercent: "random([-100, 100])",
    rotation: "random(-30, 30)",
    ease: "back.out",
    autoAlpha: 0,
    repeat: 2,
    yoyo: true,
    stagger: {
      amount: 0.5,
      from: "random",
    },
    scrollTrigger:{
      trigger: '#space-03',
      start: '450% top',
      end: '710% bottom',
      scrub: true,
    }, 
  })
  const textspace4 = new SplitText('.text-space4', {
    type: 'chars',
    charsClass: 'char',
    position: 'relative'
  });
  gsap.from('.text-space4 .char', {
    duration: 2,
    opacity:0,
    x: 100,
    stagger: 0.05,
    scrollTrigger:{
      trigger: '#space-04',
      start: '420% top',
      end: '620% bottom',
      scrub: true,
      // markers: true,
    },
    scrambleText: {
      text: 'x',
      chars: 'lowerCase',
      speed: 0.3,
      delimiter: ' ',
      tweenLength: false
    },
    ease: 'expo'
  })
  const textspace5 = new SplitText('.text-space5', {
    type: 'chars',
    charsClass: 'char',
    position: 'relative'
  });
  gsap.from('.text-space5 .char', {
    duration: 2,
    opacity:0,
    y: 100,
    stagger: 0.05,
    scrollTrigger:{
      trigger: '#space-05',
      start: '430% top',
      end: '630% bottom',
      scrub: true,
      // markers: true,
    },
    scrambleText: {
      text: 'x',
      chars: 'lowerCase',
      speed: 0.3,
      delimiter: ' ',
      tweenLength: false
    },
    ease: 'expo'
  })
 }
////////////////////////////////////////////////////////
ngOnDestroy(): void {
      if (this.animationFrameId) {
        cancelAnimationFrame(this.animationFrameId);
      }
      
      const canvas = this.threeRenderer?.domElement;
      if (canvas) {
        canvas.removeEventListener('mousedown', this.onMouseDown);
        canvas.removeEventListener('touchstart', this.onTouchStart);
        canvas.removeEventListener('touchmove', this.onTouchMove);
        canvas.removeEventListener('touchend', this.onTouchEnd);
      }
      
      window.removeEventListener('mouseup', this.onMouseUp);
      window.removeEventListener('mousemove', this.onMouseMove);
      window.removeEventListener('resize', this.onWindowResize);
      
      if (this.sphere) {
        this.sphere.geometry.dispose();
        if (this.sphere.material instanceof THREE.Material) {
          this.sphere.material.dispose();
        }
      }
      
      this.textures.forEach(texture => texture.dispose());
      
      if (this.threeRenderer) {
        this.threeRenderer.dispose();
      }
}

}


