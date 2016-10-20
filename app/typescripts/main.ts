/// <reference path="definitions/jquery/jquery.d.ts" />

namespace app {


    interface Month {
        name: number;
        months: [number];
    };

    interface Calendar {
        calendar: [Month];
    }

    export class Main {
        
        private pathCalendar: string;
        private calendar: Calendar;

        private currentYear: number;
        private currentStats: [number];

        constructor() {

            this.pathCalendar = '../jsons/calendar.json';
        }

        init() {

            this
                .cacheElements()
                .bindings();
        }

        private cacheElements(): this {

            return this;
        }

        private bindings(): this {


            this
                .loadCalendar()
                .then( this.getLastYear.bind( this ) )
                .then( () => { console.log(this.currentYear); })
                

            return this;
        }

        private loadCalendar():JQueryPromise<{}> {

            return $.getJSON( this.pathCalendar);
        }

        private getLastYear( data: Calendar ): JQueryPromise<{}> {

            var defer = $.Deferred();

            const currentYear = data.calendar[ data.calendar.length - 1 ];

            this.currentYear = currentYear.name;

            setTimeout(()=>{

                defer.resolve()
            }, 2000);

            return defer.promise();
        }
    }

    export const main = new Main();
    main.init();
}