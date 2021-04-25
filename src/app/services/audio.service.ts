import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { NativeAudio } from '@ionic-native/native-audio/ngx';


@Injectable({
  providedIn: 'root'
})

export class AudioService {

 
  private sounds: Sound[] = [];
  private audioPlayer: HTMLAudioElement = new Audio();
  private forceWebAudio: boolean = true;

  constructor(private platform: Platform, public nativeAudio: NativeAudio){

  }

  preload(key: string, asset: string): void {

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

  loop(key: string): void {

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
      this.audioPlayer.loop();

    }

  }


  stop(key: string): void {

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