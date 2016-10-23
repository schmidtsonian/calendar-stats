/// <reference path="definitions/jquery/jquery.d.ts" />

////////////////////////////////
//
// this is only an exercice, the promises are just for practice
//
//

interface JQuery {
    swipe(swipe: any): any
}

namespace app {

    interface Year {
        name: number;
        months: [number];
    };

    interface Calendar {
        calendar: [Year];
    }

    export class Main {
        
        private pathCalendar     : string;
        private data             : Calendar;

        private currentYear      : number;
        private currentStats     : [number];

        private classNameDisable : string;
        private classNameEneable : string;
        private classNameYear    : string;

        private delayActiveStats : number; //in milliseconds

        private $container       : JQuery;
        private $year            : JQuery;
        private $stats           : JQuery;

        constructor() {

            this.pathCalendar     = '../jsons/calendar.json';
            this.classNameDisable = 'disable';
            this.classNameEneable = 'eneable';
            this.classNameYear    = 'year__name';

            this.delayActiveStats = 450;
            
            this.$container       = $( '#js-conainer' )
            this.$year            = $( '#js-year', this.$container );
            this.$stats           = $( '.js-stats', this.$container );
        }

        init() {

            this
                .bindings()
                .loadCalendar()
                .then( this.getLastYear.bind( this ) )
                .then( this.setYears.bind( this ) )
                .then( this.getStats.bind( this ) )
                .then( this.setStats.bind( this ) );
        }

        private bindings(): this {

            $( document )
            .keydown( ( e: JQueryKeyEventObject ) => {

                switch( e.which ) {
                    // left
                    case 37: this.loadYear( this.currentYear - 1, e ); break;
                    case 40: this.loadYear( this.currentYear - 1, e ); break;

                    // right
                    case 39: this.loadYear( this.currentYear + 1, e ); break;
                    case 38: this.loadYear( this.currentYear + 1, e ); break;
                    case 32: this.loadYear( this.currentYear + 1, e ); break;
                };
            });

            this.$container
            .swipe( {
                swipe: ( event: any, direction: any, distance: any, duration: any, fingerCount: any, fingerData: any ) => {

                  if( direction == 'left'  ) this.loadYear( this.currentYear + 1 );
                  if( direction == 'right' ) this.loadYear( this.currentYear - 1 );
                },
            });

            return this;
        }

        private loadCalendar(): JQueryPromise<{}> {

            return $.getJSON( this.pathCalendar );
        }

        // private loadCalendar(): JQueryPromise<{}> {

        //     var defer = $.Deferred();

        //     defer.resolve( {
        //         "calendar": [
        //             {"name": 2014, "months": [25, 30, 50, 24, 12, 54, 55, 70, 80, 34, 52, 54 ] },
        //             {"name": 2015, "months": [35, 40, 60, 34, 22, 64, 65, 80, 90, 44, 62, 64 ] },
        //             {"name": 2016, "months": [45, 50, 70, 44, 32, 74, 75, 90, 95, 54, 72, 74 ] }
        //         ]
        //     });

        //     return defer.promise();
        // }

        private getLastYear( data: Calendar ): JQueryPromise<{}> {

            var defer = $.Deferred();

            this.data = data;
            const currentYear = this.data.calendar[ this.data.calendar.length - 1 ];
            this.currentYear = currentYear.name;

            defer.resolve();

            return defer.promise();
        }

        private setYears(): JQueryPromise<{}> {
            var defer = $.Deferred();

            this.$year.html('');
            for (var i = this.data.calendar.length - 1; i >= 0; i--) {
                
                let digits = ( '' +  this.data.calendar[i].name ).split( '' );

                let year = '';

                for ( var ii = 0; ii < digits.length; ii++ ) {

                    year += '<span>' + digits[ ii ] + '</span>';
                }

                this.$year.append('<div class="' + this.classNameYear + '">' + year + '</div>');
            }

            defer.resolve();

            return defer.promise();
        }

        private getStats( yearName: number = this.currentYear ): JQueryPromise<Year> {

            var defer = $.Deferred();

            for ( var i = this.data.calendar.length - 1; i >= 0; i-- ) {

                if( this.data.calendar[ i ].name == yearName ) {
                    
                    defer.resolve( this.data.calendar[ i ] );
                    
                    return defer.promise();
                }
            }

            defer.resolve( null );

            return defer.promise();
        }

        private setStats( year: Year ): JQueryPromise<Year> {

            var defer = $.Deferred();
            
            if( year ){
                this.currentYear = year.name;
                this.currentStats = year.months;

                this.displayData();
            }

            defer.resolve( null );

            return defer.promise();
        }

        private displayData() {

            this.$container .addClass( this.classNameDisable );

            setTimeout( () => {

                this.$container.removeClass( this.classNameDisable );
            }, this.delayActiveStats );

            let $yearsName = $('.' + this.classNameYear);
            $yearsName.removeClass(this.classNameEneable);

            for ( var i = $yearsName.length-1; i >= 0; i-- ) {
                if($yearsName.eq(i).text() == this.currentYear + '') {
                    
                    $yearsName.eq(i).addClass(this.classNameEneable);
                    break;
                }
            }
            for (var i = this.currentStats.length - 1; i >= 0; i--) {
                
                this.$stats
                .eq(i)
                .find('.bar')
                .css({'height': (100 - this.currentStats[i]) + '%'});
            }
            
            
        }

        private loadYear( yearName: number, e?: JQueryKeyEventObject ) {

            if( e ) e.preventDefault(); // prevent the default action (scroll / move caret)

            this
                .getStats(yearName)
                .then( this.setStats.bind( this ) );
        }
    }
}

let main: any;


$('document')
.ready( () => {
    main = new app.Main();
    main.init();
});


