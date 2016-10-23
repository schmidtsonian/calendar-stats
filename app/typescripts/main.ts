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
        
        private pathCalendar: string;
        private data: Calendar;

        private currentYear: number;
        private currentStats: [number];

        private classNameDisable: string;
        private classNameEneable: string;
        private classNameYear: string;

        private $container: JQuery;
        private $year: JQuery;
        private $stats: JQuery;

        constructor() {

            this.pathCalendar = '../jsons/calendar.json';
            this.classNameDisable = 'disable';
            this.classNameEneable = 'eneable';
            this.classNameYear = 'year__name';
            
            this.$container = $( '#js-conainer' )
            this.$year = $( '#js-year', this.$container );
            this.$stats = $( '.js-stats', this.$container );
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

            $(document).keydown( (e) => {

                switch( e.which ) {
                    // left
                    case 37: 
                        this.loadYear(this.currentYear - 1);
                        break;
                    case 40: 
                        this.loadYear(this.currentYear - 1);
                        break;

                    // right
                    case 39:
                        this.loadYear(this.currentYear + 1);
                        break;
                    case 38:
                        this.loadYear(this.currentYear + 1);
                        break;
                    case 32:
                        this.loadYear(this.currentYear + 1);
                        break;
                }
                e.preventDefault(); // prevent the default action (scroll / move caret)
            });

            this.$container.swipe({
                swipe: (event: any, direction: any, distance: any, duration: any, fingerCount: any, fingerData: any) => {

                  if(direction == 'left') this.loadYear(this.currentYear - 1);
                  if(direction == 'right') this.loadYear(this.currentYear + 1);
                },
            });

            return this;
        }

        private loadCalendar(): JQueryPromise<{}> {

            return $.getJSON( this.pathCalendar);
        }

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
            }, 950 );

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

        private loadYear( yearName: number ) {

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


