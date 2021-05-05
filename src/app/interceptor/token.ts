import {Injectable} from '@angular/core';
import {HttpInterceptor,HttpRequest,HttpResponse,HttpHandler,HttpEvent,HttpErrorResponse} from '@angular/common/http';
import { Observable, throwError, from } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';
import { AlertController } from '@ionic/angular';
import { AuthConstants } from '../config/auth-constants';
import { StorageService } from '../services/storage.service';



@Injectable()
export class TokenInterceptor implements HttpInterceptor {
   
    protected debug = true;

    constructor(private alertController: AlertController, private storageService: StorageService) {

    }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return from(this.storageService.get(AuthConstants.AUTH)) 
            .pipe(               
                switchMap(token => {
                    if (token) {
                        request = request.clone({ headers: request.headers.set('Authorization', 'Bearer ' + token) });
                    }

                    if (!request.headers.has('Content-Type')) {
                        request = request.clone({ headers: request.headers.set('Content-Type', 'application/json') });
                    }                 

                    return next.handle(request).pipe(
                        map((event: HttpEvent<any>) => {
                            if (event instanceof HttpResponse) {
                                // do nothing for now
                            }
                            return event;
                        }),
                        catchError((error: HttpErrorResponse) => {
                            const status =  error.status;
                            const reason = error && error.error.reason ? error.error.reason : '';

                            this.presentAlert(status, reason);
                            return throwError(error);
                        })
                    );
                })
            );


    }

    async presentAlert(status, reason) {
        const alert = await this.alertController.create({
            header: status + ' Error',
            subHeader: 'Ocurrio un error en la conección al servidor',
            message: reason,
            buttons: ['OK']
        });

        await alert.present();
    }
}
