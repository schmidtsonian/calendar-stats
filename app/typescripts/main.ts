/// <reference path="definitions/jquery/jquery.d.ts" />


////////////////////////////////
//
// this is only an exercice, the promises are just for practice
//
//
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

        private $container: JQuery;
        private $year: JQuery;
        private $stats: JQuery;

        constructor() {

            this.pathCalendar = '../jsons/calendar.json';
            this.classNameDisable = 'disable';
            
            this.$container = $( '#js-conainer' )
            this.$year = $( '#js-year' );
            this.$stats = $( '.js-stats' );
        }

        init() {

            this
                .loadCalendar()
                .then( this.getLastYear.bind( this ) )
                .then( this.getStats.bind( this ) )
                .then( this.setStats.bind( this ) );
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


            let digits = ( '' + this.currentYear ).split( '' );
            this.$year.html('');

            for ( var i = digits.length-1; i >= 0; i-- ) {

                this.$year.prepend('<span>' + digits[ i ] + '</span>');
            }
            for (var i = this.currentStats.length - 1; i >= 0; i--) {
                
                this.$stats
                .eq(i)
                .find('.bar')
                .css({'height': (100 - this.currentStats[i]) + '%'});
            }
            
            this.$container
            .removeClass( this.classNameDisable );
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


