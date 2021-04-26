import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { NativeAudio } from '@ionic-native/native-audio/ngx';


@Injectable({
  providedIn: 'root'
})

export class AudioService {

 

  readonly ALARM_PLAY = 'alarma-activa';
  readonly ALARM_DERECHA = 'derecha';
  readonly ALARM_IZQUIERDA = 'izquierda';
  readonly ALARM_ARRIBA = 'arriba';  
  readonly ALARM_STOP = 'alarma-desactivar'


  private sounds: Sound[] = [];
  private audioPlayer: HTMLAudioElement = new Audio();
  private forceWebAudio: boolean = true;

  constructor(private platform: Platform, public nativeAudio: NativeAudio){

  }

  desactivar(){
    this._stop(this.ALARM_PLAY);
    this._stop(this.ALARM_DERECHA);
    this._stop(this.ALARM_IZQUIERDA);
    this._stop(this.ALARM_ARRIBA);    
  }

  preload(){
      this._preload(this.ALARM_PLAY, 'assets/sonidos/alarma-activa.mp3');
      this._preload(this.ALARM_STOP, 'assets/sonidos/alarma-desactivar.mp3');
      this._preload(this.ALARM_DERECHA, 'assets/sonidos/derecha.mp4');
      this._preload(this.ALARM_IZQUIERDA, 'assets/sonidos/izquierda.mp4');
      this._preload(this.ALARM_ARRIBA, 'assets/sonidos/arriba.mp4');      
  }

  sonarDerecha(){
    this._stop(this.ALARM_IZQUIERDA);
    this._stop(this.ALARM_PLAY);
    this._loop(this.ALARM_DERECHA);
  }

  sonarIzquierda(){
    this._stop(this.ALARM_DERECHA);
    this._stop(this.ALARM_PLAY);
    this._loop(this.ALARM_IZQUIERDA);
  }

  sonarAlarma(){
    this._stop(this.ALARM_DERECHA);
    this._stop(this.ALARM_IZQUIERDA);
    this._loop(this.ALARM_PLAY);
  }

  sonarDesactivacion(){
    this._stop(this.ALARM_DERECHA);
    this._stop(this.ALARM_PLAY);
    this._stop(this.ALARM_IZQUIERDA);    
    this._play(this.ALARM_STOP);
  }

  protected _preload(key: string, asset: string): void {

    if(this.platform.is('cordova') && !this.forceWebAudio){

      this.nativeAudio.preloadSimple(key, asset);

      this.sounds.push({
        key: key,
        asset: asset,
        isNative: true
      });

    } else {

      let audio = new Audio();
      audio.src = asset;

      this.sounds.push({
        key: key,
        asset: asset,
        isNative: false
      });

    }

  }

  protected _play(key: string): void {

    let soundToPlay = this.sounds.find((sound) => {
      return sound.key === key;
    });

    if(soundToPlay.isNative){

      this.nativeAudio.play(soundToPlay.asset).then((res) => {
        console.log(res);
      }, (err) => {
        console.log(err);
      });

    } else {

      this.audioPlayer.src = soundToPlay.asset;
      this.audioPlayer.loop = false;
      this.audioPlayer.play();

    }

  }

  protected _loop(key: string): void {

    let soundToPlay = this.sounds.find((sound) => {
      return sound.key === key;
    });

    if(soundToPlay.isNative){

      this.nativeAudio.loop(soundToPlay.asset).then((res) => {
        console.log(res);
      }, (err) => {
        console.log(err);
      });

    } else {
      this.audioPlayer.src = soundToPlay.asset;
      this.audioPlayer.loop = true;
      this.audioPlayer.play();
    }

  }

  protected _stop(key: string): void {

    let soundToPlay = this.sounds.find((sound) => {
      return sound.key === key;
    });

    if(soundToPlay.isNative){

      this.nativeAudio.stop(soundToPlay.asset).then((res) => {
        console.log(res);
      }, (err) => {
        console.log(err);
      });

    } else {

      this.audioPlayer.src = soundToPlay.asset;
      this.audioPlayer.pause();

    }

  }
}

interface Sound {
  key: string;
  asset: string;
  isNative: boolean
}