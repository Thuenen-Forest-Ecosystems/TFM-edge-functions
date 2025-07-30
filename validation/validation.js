(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.TFM = factory());
})(this, (function () { 'use strict';

    const errorCodes = [
        {
            "err": 612712,
            "ekz": "W",
            "Fehler_kurz": "Aufbau widerspricht Bestockung",
            "Fehler_lang": "Aufbau=1 (einschichtig) widerspricht der Bestockungsaufnahme",
            "Hinweis": "Überprüfen Sie ob tatsächlich sowohl Bäume bis 4 m als auch Bäume über 4 m vorhanden sind oder ob der Aufbau falsch angegeben wurde! "
        },
        {
            "err": 613806,
            "ekz": "F",
            "Fehler_kurz": "Spiegelungsart fehlt (Bäume>4m)",
            "Fehler_lang": "Bestockung über 4 m Höhe - Art der Spiegelung: Wert fehlt",
            "Hinweis": "Es wurden Baumarten für Bestockung über 4 m Höhe aufgezählt, aber es fehlt die Art der Spiegelung. Wenn nicht gespiegelt wurde, dann ist 0 anzugeben"
        },
        {
            "err": 613813,
            "ekz": "F",
            "Fehler_kurz": "Spiegelungsart 0 <-> Baumdaten: Wenn Bäume gespiegelt wurden, muss die Spiegelungsart > 0 sein",
            "Fehler_lang": "Bestockung über 4 m Höhe - Art der Spiegelung: Als Spiegelungsart wurde 0 angegeben, aber es gibt ein oder mehrere Bäume in der WZP1\/2, die gespiegelt wurden",
            "Hinweis": "Wenn Bäume gespiegelt wurden, muss die Spiegelungsart > 0 sein."
        },
        {
            "err": 613814,
            "ekz": "W",
            "Fehler_kurz": "Spiegelungsart größer 0 <-> Baumdaten: Wenn keine Bäume gespiegelt wurden, muss die Spiegelungsart = 0 sein",
            "Fehler_lang": "Bestockung über 4 m Höhe - Art der Spiegelung: Als Spiegelungsart wurde 1 oder 2 angegeben, aber es gibt keine Bäume in der WZP1\/2, die gespiegelt wurden.",
            "Hinweis": "Wenn Bäume gespiegelt wurden, muss die Spiegelung für den Einzelbaum 1 (gesetztes Häkchen) sein."
        },
        {
            "err": 613906,
            "ekz": "F",
            "Fehler_kurz": "Zählfaktor fehlt (Bäume>4 m)",
            "Fehler_lang": "Bestockung über 4 m Höhe - Zählfaktor: Wert fehlt",
            "Hinweis": "Es wurden Baumarten für Bestockung über 4 m Höhe aufgezählt, aber es fehlt der Zählfaktor"
        },
        {
            "err": 614106,
            "ekz": "F",
            "Fehler_kurz": "Schicht fehlt (Bäume<=4m)",
            "Fehler_lang": "Bestockung bis 4 m Höhe - Schicht  (Feld 'Schicht' im linken Block): Wert fehlt",
            "Hinweis": "Es wurden Baumarten für Bestockung bis 4 m Höhe aufgezählt, aber es fehlt die Schichtzuordnung"
        },
        {
            "err": 750610,
            "ekz": "W",
            "Fehler_kurz": "Summe Anzahl zu hoch?",
            "Fehler_lang": "Die Summe von Anzahl ist >=50 bei ZF=1 bzw. >=30 bei ZF=2",
            "Hinweis": "Kontrollieren Sie ob nicht zuviele Bäume gemessen wurde, bzw. ein Tippfehler bei Anzahl vorhanden ist"
        },
        {
            "err": 750910,
            "ekz": "F",
            "Fehler_kurz": "Spiegelungsart > 0 <-> Baumdaten: Wenn Bäume nicht gespiegelt wurden, muss die Spiegelungsart = 0 sein",
            "Fehler_lang": "Für den Baum bzw. die Baumart in der WZP1\/2 wurde Spiegelung (1=ja) angegeben, aber die Spiegelungsart (im Kopf des Fromulares, Teil WZP1\/2) ist mit 0=\"ohne Spiegelung\" angegeben",
            "Hinweis": "Bitte lösen Sie den Widerspruch auf."
        },
        {
            "err": 750911,
            "ekz": "F",
            "Fehler_kurz": "Spiegelungsart 0 <-> Baumdaten: Wenn Bäume gespiegelt wurden, muss die Spiegelungsart > 0 sein",
            "Fehler_lang": "Für den Baum bzw. die Baumart in der WZP1\/2 wurde keine Spiegelung (0=nein) angegeben, aber die Spiegelungsart (im Kopf des Fromulares, Teil WZP1\/2) ist mit 1=\"mit Spiegelung\" angegeben",
            "Hinweis": "Bitte lösen Sie den Widerspruch auf."
        },
        {
            "err": 612706,
            "ekz": "F",
            "Fehler_kurz": "Aufbau fehlt",
            "Fehler_lang": "Aufbau (Bestockung): Wert fehlt.  Der Aufbau der Bestockung muss dann angegeben werden, wenn Bäume bis 4 m Höhe (im Probekreis r=10m) und\/oder über 4m Höhe erfasst werden (in der WZP1\/2).",
            "Hinweis": null
        },
        {
            "err": 612806,
            "ekz": "F",
            "Fehler_kurz": "Alter fehlt",
            "Fehler_lang": "Alter: Wert fehlt.  Das Bestockungsalter muss dann angegeben werden, wenn Bäume bis 4 m Höhe (im Probekreis r=10m) und\/oder über 4m Höhe erfasst werden (in der WZP1\/2).",
            "Hinweis": "Das Bestockungsalter darf nur dann fehlen, wenn Betriebsart=2=Plenterwald ist Siehe Formular EAL"
        },
        {
            "err": 749911,
            "ekz": "F",
            "Fehler_kurz": "Bäume bis 4m  oder  größer 4m Höhe aufgenommen",
            "Fehler_lang": "Es wurden Bäume bis 4 m oder  größer 4m Höhe erfasst (Formular 'EBS'), obwohl sie lt. Waldentscheid oder Begehbarkeit nicht hätten aufgenommen werden können \/sollen",
            "Hinweis": "Prüfen Sie ob der Waldentscheid (ungleich 5 und 3) oder Begehbarkeit (ungleich 1) korrekt sind. Oder löschen Sie die Bäume\/Daten im Formular 'EBS', Block links 'Bäume bis 4 m Höhe'"
        },
        {
            "err": 759991,
            "ekz": "F",
            "Fehler_kurz": "keine Hauptbestockung",
            "Fehler_lang": "Es wurden keine Bäume der Hauptbestockung (Felder 'Schicht') zugeordnet",
            "Hinweis": "Schicht=1 (Hauptbestockung) weder für alle Bäume bis 4m Höhe (in Tabelle b3v_ecke_feld.SchiLE4_Schi) noch für einzelne\/alle Bäume über 4m Höhe (in Tabelle b3v_lt4m_ba.Schi) angegeben"
        },
        {
            "err": 740413,
            "ekz": "F",
            "Fehler_kurz": "SummeAnteile <> 10 (Bäume<=4m)",
            "Fehler_lang": "Bestockung bis 4 m Höhe - Die Summe der Baumartenanteile  ist ungleich  10 (100%)",
            "Hinweis": "Anteile der Baumarten (bis 4m Höhe) müssen sich zu 10 addieren."
        },
        {
            "err": 750511,
            "ekz": "F",
            "Fehler_kurz": "2 mal Hauptbestockung vergeben (<4m u. >4m)",
            "Fehler_lang": "Bestockung über 4 m Höhe - Schicht: Wert (Hauptbestockung) steht im Widerspruch zur Schicht aller Bäume bis 4m Höhe (auch Hauptbestockung)",
            "Hinweis": "Hauptbestockung darf ENTWEDER für die Bestockung bis 4m Höhe ODER für Bäume über 4m Höhe angegeben werden. "
        },
        {
            "err": 612711,
            "ekz": "F",
            "Fehler_kurz": "Aufbau <-> Betriebsart",
            "Fehler_lang": "Widerspruch zwischen Aufbau (Bestockung) und Betriebsart: Wert unzulässig",
            "Hinweis": "Bei Betriebsart 2 (Plenterwald) wird Aufbau = 6 (mehrschichtig oder plenterartig) erwartet"
        },
        {
            "err": 612705,
            "ekz": "W",
            "Fehler_kurz": "Hauptbestockung ,Aufbau, Alter unwahrsch.",
            "Fehler_lang": "Hauptbestockung im 10 m Kreis bei Aufbau =2 (zweischichtig) und Alter >= 50 ist unwahrscheinlich",
            "Hinweis": "Überprüfen Sie Alter und Aufbau für Bäume  <4 m"
        },
        {
            "err": 612812,
            "ekz": "F",
            "Fehler_kurz": "Alter <-> Betriebsart",
            "Fehler_lang": "Widerspruch zwischen Alter (Bestockung) und Betriebsart: Bei Betriebsart Plenterwald (2) darf kein Alter angegeben werden",
            "Hinweis": "Bei Betriebsart ungleich 2 (Plenterwald) muss das Alter > 7 (=Mindestalter) sein; Für Betriebsart Plenterwald ist keine Altersangabe zulässig (alternativ zu keine Angabe)"
        },
        {
            "err": 613912,
            "ekz": "F",
            "Fehler_kurz": "Zählfaktor 2 für Bäume > 4 m Höhe",
            "Fehler_lang": "Bestockung: Es wurden mit einem falschen Zählfaktor für Bäume über 4 m Höhe gearbeitet.",
            "Hinweis": "Zählfaktor 2 ist nur erlaubt, wenn in der WZP\/ZF4 mehr als 10 Bäume (mit Probebaumkennziffer Bk= 0 oder 1) aufgenommen worden sind. Ansonsten ist mit Zählfaktor 1 zu arbeiten."
        },
        {
            "err": 759914,
            "ekz": "F",
            "Fehler_kurz": "Anzahl WZP\/ZF4 <-> WZP\/ZF1o.2",
            "Fehler_lang": "Es wurden weniger Bäume je Baumart in der Winkelzählprobe ZF1 bzw. 2 erfasst als in der Winkelzählprobe ZF4",
            "Hinweis": "Bäume, die in der WZP\/ZF4 erfasst worden sind (Formular 'WZP4', Bäume mit Bk=0 oder 1), müssen auch in der WZP\/ZF1o.2 erfasst werden (Formular 'EBS', Bäume über 4 m Höhe)"
        },
        {
            "err": 759916,
            "ekz": "F",
            "Fehler_kurz": "Ba: WZP\/ZF4 <-> WZP\/ZF1o.2",
            "Fehler_lang": "Es wurden Baumarten in der Winkelzählprobe ZF=4  erfasst, die in der Winkelzählprobe ZF1 bzw. 2 nicht erfasst wurden",
            "Hinweis": "Baumarten, die in der WZP\/ZF4 erfasst worden sind (Formular 'WZP4', Bäume mit Bk=0 oder 1), müssen auch in der WZP\/ZF1o.2 erfasst werden (Formular 'EBS', Bäume über 4 m Höhe)"
        },
        {
            "err": 613911,
            "ekz": "W",
            "Fehler_kurz": "Zählfaktor überflüssig (Bäume>4m)",
            "Fehler_lang": "Bestockung über 4 m Höhe - Zählfaktor: Wert überflüssig",
            "Hinweis": "Es wurden keine Baumarten für Bestockung über 4 m Höhe aufgezählt, aber ein Zählfaktor angegeben"
        },
        {
            "err": 759913,
            "ekz": "F",
            "Fehler_kurz": "Schicht über 4 m falsch",
            "Fehler_lang": "Bestockung über 4 m Höhe: Bäume dürfen nur entweder der Hauptbestockung (1) ODER der Restbestockung (3) zugeordnet werden!",
            "Hinweis": "Alle Bäume müssen der gleichen Schicht zugeordnet werden (entweder Haupt- (1) oder Restbestockung (3); Ausnahmen: 9=schon 'bis 4m Höhe' angegeben)"
        },
        {
            "err": 759917,
            "ekz": "W",
            "Fehler_kurz": "keine Bäume im Hb",
            "Fehler_lang": "Es wurden im Formular EBS (Ansicht Bäume über 4m Höhe) keine Bäume in der Hauptbestockung erfasst hingegen bei der WZP4 im Hauptbestand",
            "Hinweis": "Kontrollieren Sie bitte die Angaben zu Hauptbestand in EBS (Ansicht: Bäume über 4m Höhe) mit die Bestandesschichtangaben in WZP4, ob bei einem Formular die Schichtangabe falsch ist"
        },
        {
            "err": 759918,
            "ekz": "F",
            "Fehler_kurz": "Baumart: über 4 m <-> unter 4 m",
            "Fehler_lang": "Es wurden im Formular EBS (Ansicht Bäume über 4m Höhe) eine Baumart mit  Schicht = 9 (im Kreis R=10 berücksichtigt) erfasst, diese ist aber nicht in der Ansicht Bäume bis 4m Höhe aufgelistet",
            "Hinweis": "Kontrollieren Sie die Schichtangabe =9 bwz. ergänzen Sie die betreffende Baumart in Ansicht Bäume bis 4m Höhe"
        },
        {
            "err": 613006,
            "ekz": "F",
            "Fehler_kurz": "Phase \/ Dimensionsklasse fehlt",
            "Fehler_lang": "Entwicklungsphase \/ Dimensionsklasse: Wert fehlt. Die Phase der Hauptbestockung muss dann angegeben werden, wenn Bäume bis 4 m Höhe (im Probekreis r=10m) und\/oder über 4m Höhe erfasst werden (in der WZP1\/2).",
            "Hinweis": "Die Phase der Hauptbestockung ist neben der natürlichen Waldgesellschaft (Feldangabe) eine fundamentale Ausgangsgröße für den Waldlebensraumtypalgorithmus."
        },
        {
            "err": 614006,
            "ekz": "F",
            "Fehler_kurz": "DG fehlt (Bäume<=4m Höhe)",
            "Fehler_lang": "Bestockung bis 4 m Höhe - Deckungsgrad (Feld 'DG'): Wert fehlt",
            "Hinweis": "Es wurden Baumarten für Bestockung bis 4 m Höhe aufgezählt, aber es fehlt der Deckungsgrad"
        },
        {
            "err": 810419,
            "ekz": "F",
            "Fehler_kurz": "Rk>2000",
            "Fehler_lang": "Die Waldrandkennziffer Rk darf nicht größer als 2000 sein",
            "Hinweis": "Der Waldrand wurde bei der Vorgängerinventur  (RkV_Soll) NICHT als ausgeschieden deklariert. Die Waldrandkennziffer Rk darf deshalb NICHT  größer als 2000 sein (mit 2000 sind Ränder gekennzeichnet, die bei einer früheren Inventur ausgefallen sind )."
        },
        {
            "err": 819941,
            "ekz": "F",
            "Fehler_kurz": "max. 2 Linien zulässig",
            "Fehler_lang": "für CI 2017 (Waldrandkennziffer Rk=0 oder 1) dürfen nur max. 2 Wald- bzw. Bestandesränder definiert werden.",
            "Hinweis": "Bitte Wald- bzw. Bestandesrandverlauf vereinfachen (begradigen o.ä.); Linien, die sich schneiden, bitte als EINE geknickte Linie definieren!"
        },
        {
            "err": 810413,
            "ekz": "F",
            "Fehler_kurz": "Rk<->Vorgängerdaten",
            "Fehler_lang": "Waldrand-\/Bestandesgrenzen-Kennziffer (Spalte 'Rk'): Wert ungleich 0 und ungleich 4 unzulässig",
            "Hinweis": "Der Waldrand bzw. die Bestandeslinie ist aus keiner Vorgängerinventur bekannt. Deshalb ist die Linie NEU und die Randkennziffer Rk darf nur 0 oder 4 sein (neuer Rand bzw. neue Linie)"
        },
        {
            "err": 819922,
            "ekz": "F",
            "Fehler_kurz": "Knick- = Endpkt",
            "Fehler_lang": "Knickpunkt (Felder 'Knick_Hori, Knick_Azi) ist identisch mit Endpunkt (Felder 'E_Hori', 'E_Azi')",
            "Hinweis": null
        },
        {
            "err": 819942,
            "ekz": "W",
            "Fehler_kurz": "Grenzkreis außerhalb Bestandesgrenze",
            "Fehler_lang": "weil die Grenze den  Grenzkreise schneidet, (sekante)",
            "Hinweis": "Bitte messen Sie die Grenze ggf neu ein oder löschen sie diese"
        },
        {
            "err": 819943,
            "ekz": "F",
            "Fehler_kurz": "Baum außerhalb Wald-/Bestandesgrenze",
            "Fehler_lang": "Bäume des Waldstücks/Bestandes müssen diesseits der Wald-/Bestandesgrenze stehen.",
            "Hinweis": "Bitte überprüfen Sie die Grenze, Probepunkt- oder Baumkoordinaten"
        },
        {
            "err": 819912,
            "ekz": "F",
            "Fehler_kurz": "keine Waldränder\/Bestandesgrenzen",
            "Fehler_lang": "Es wurden keine Waldränder oder Bestandesgrenzen erfasst (Formular 'RAN')",
            "Hinweis": "Prüfen Sie, ob die Aufnahme von Waldrändern oder Bestandesgrenzen (Formular 'RAN') vergessen wurde! Sie können rechts neben dem Datenbanknavigator 0='keine Objekte vorhanden' eintragen, um diese Meldung zukünftig zu unterdrücken."
        },
        {
            "err": 613106,
            "ekz": "F",
            "Fehler_kurz": "Nutzungsart fehlt",
            "Fehler_lang": "Nutzungsart: Wert fehlt",
            "Hinweis": null
        },
        {
            "err": 612110,
            "ekz": "W",
            "Fehler_kurz": "Geländeneigung unzulässig",
            "Fehler_lang": "Geländeneigung [Grad]: Wert unzulässig >3 [Grad] bei Geländeform=0 (Ebene) ",
            "Hinweis": "erwartet: <=3 Grad. Geländeform =0 (Ebene)"
        },
        {
            "err": 612291,
            "ekz": "W",
            "Fehler_kurz": "Geländeexposition unnötig",
            "Fehler_lang": "Geländeexposition [gon]: Wert nicht erforderlich",
            "Hinweis": "hier überflüssig - nur erforderlich, wenn Geländeneigung > 3 Grad (Überprüfen Sie vorsichtshalber die Geländeneigung)"
        },
        {
            "err": 612306,
            "ekz": "F",
            "Fehler_kurz": "Betriebsart fehlt",
            "Fehler_lang": "Betriebsart: Wert fehlt",
            "Hinweis": null
        },
        {
            "err": 619994,
            "ekz": "W",
            "Fehler_kurz": "Merkmale überflüssig",
            "Fehler_lang": "Obwohl eine Blöße ausgeschieden wurde, wurden WZP-Bäume bzw. Verjüngung aufgenommen",
            "Hinweis": "Kontrollieren Sie, ob  Waldentscheid=3 (Blöße) richtig ist. "
        },
        {
            "err": 432715,
            "ekz": "F",
            "Fehler_kurz": "keine Nutz.Einschr. aber innerbetr. Ursachen",
            "Fehler_lang": "Es wurde mind. 1 Ursache für innerbetriebliche Nutzungseinschränkungen angegeben, aber keine Nutzungseinschränkung vermerkt (Spalte 'Nutz.Einschr.<=0')",
            "Hinweis": "Wenn mind. eine der Spalten  'Streulage', 'unzur. Erschließung', 'Gelände', 'geringer Ertrag',  's. innerbetriebl. Urs.') 1 ist , muss Spalte 'Nutz.Einschr.' größer 0 sein"
        },
        {
            "err": 619993,
            "ekz": "W",
            "Fehler_kurz": "Merkmale überflüssig",
            "Fehler_lang": "Es wurden Merkmale angesprochen, die für Nichtwald bzw. Ecken außerhalb Inventurgebiet nicht relevant sind. Dies gilt auch für Nichtbegehbarkeit.",
            "Hinweis": "Kontrollieren Sie, ob Wald\/Nichtwald=0 (Nichtwald) oder 8\/9 (nicht relevant) richtig ist oder Begehbarkeit. (Überflüssige Merkmale: Geländeform, Biotop, Betriebsart, nat.Waldgesellschaft(Feld), bes. Gefährdung, Aufbau, Altersbestimmung, Alter, EZ7)"
        },
        {
            "err": 432711,
            "ekz": "F",
            "Fehler_kurz": "Waldentscheid <-> Nutzungseinschränkung ?",
            "Fehler_lang": "Widerspruch zwischen Waldentscheid (ungleich Holzboden 3 oder 5) und Nutzungseinschränkung > 0",
            "Hinweis": "Wenn die Ecke kein Holzboden ist (oder sie sogar Nichtwald ist oder außerhalb des Inventurgebietes liegt) kann keine Nutzungseinschränkung vorliegen. Kontrollieren Sie bitte den Waldentscheid und die Nutzungseinschränkung!"
        },
        {
            "err": 433106,
            "ekz": "F",
            "Fehler_kurz": "LaNu Wert fehlt",
            "Fehler_lang": "Landnutzungsart: Wert fehlt",
            "Hinweis": "Die Landnutzungsart muss angegeben werden, sowie Wald zu Nichtwald oder Nichtwald zu Wald wurde. Voraussetzung: Schnittmenge Inventurgebiet Maske VE InvE2012=1 UND Wa nicht 8 und nicht 9 (Spalten b3_ecke.DOP=InvE2012=1 UND b3f_ecke_vorkl.Wa NOT IN (8,9))"
        },
        {
            "err": 433112,
            "ekz": "F",
            "Fehler_kurz": "LaNu=99 unzulässig",
            "Fehler_lang": "Landnutzungsart: Wert 99=\"Traktecke war schon früher eindeutig Wald\" unzulässig. . Der rückwirkende Datenkorrekturwunsch des Waldentscheides 2012 zu Wald  ist unberechtigt oder falsch.",
            "Hinweis": "Erlaubt, wenn Waldentscheid der Vorgänger-Inventur falschlicher Weise 0= \"Nichtwald\" war UND Waldentscheid aktuell 3,4 oder 5 (Wald) ist, also wenn keine Landnutzungsänderung vorhanden ist. Voraussetzung: Schnittmenge Inventurgebiet beider Inventuren"
        },
        {
            "err": 433111,
            "ekz": "F",
            "Fehler_kurz": "LaNu=90 unzulässig",
            "Fehler_lang": "Landnutzungsart: Wert 90=\"Traktecke war schon früher eindeutig Nichtwald\" unzulässig. Der rückwirkende Datenkorrekturwunsch des Waldentscheides 2012 zu Nichtwald ist unberechtigt oder falsch.",
            "Hinweis": "Erlaubt, wenn Waldentscheid der Vorgänger-Inventur fälschlicher Weise 3,4,5 war und Waldentscheid aktuell 0 (Nichtwald) ist, also wenn keine Landnutzungsänderung vorhanden ist. Voraussetzung: Schnittmenge Inventurgebiet beider Inventuren"
        },
        {
            "err": 433113,
            "ekz": "F",
            "Fehler_kurz": "LaNu unzulässig",
            "Fehler_lang": "Landnutzungsart: Wert unzulässig, da die Ecke zu beiden Inventurzeitpunkten Wald war. Ausnahme ggf. Lanu=92 oder 93",
            "Hinweis": "Der Wert muss nur angegeben werden, wenn ein Landnutzungswechsel stattfand. Bei Nichtwaldecken ist diese Angabe evtl. nützlich für die Zukunft. Landnutzung kann auch angegeben werden, wenn der Waldentscheid von 2012 rückwirkend geändert werden soll (90-99). Voraussetzung: Schnittmenge Inventurgebiet"
        },
        {
            "err": 433114,
            "ekz": "F",
            "Fehler_kurz": "LaNu=92 unzulässig",
            "Fehler_lang": "Landnutzungsart: Wert 92=\"Traktecke war schon früher eindeutig Nichtholzboden\" unzulässig. Der rückwirkende Datenkorrekturwunsch des Waldentscheides 2012 zu Nichtholzboden ist unberechtigt oder falsch.",
            "Hinweis": "Erlaubt, wenn Waldentscheid der Vorgänger-Inventur fälschlicher Weise KEIN Nichtholzboden (<>4)  war und Waldentscheid aktuell 4 (Nichtholzboden) ist, also wenn keine Landnutzungsänderung vorhanden ist. Voraussetzung: Schnittmenge Inventurgebiet beider Inventuren"
        },
        {
            "err": 433115,
            "ekz": "F",
            "Fehler_kurz": "LaNu=93 unzulässig",
            "Fehler_lang": "Landnutzungsart: Wert 93=\"Traktecke war schon früher eindeutig Holzboden\" unzulässig. Der rückwirkende Datenkorrekturwunsch des Waldentscheides 2012 zu Holzboden ist unberechtigt oder falsch.",
            "Hinweis": "Erlaubt, wenn Waldentscheid der Vorgänger-Inventur fälschlicher Weise 0 oder 4 war und Waldentscheid aktuell 3 oder 5 (Holzboden) ist, also wenn keine Landnutzungsänderung vorhanden ist. Voraussetzung: Schnittmenge Inventurgebiet beider Inventuren"
        },
        {
            "err": 433116,
            "ekz": "F",
            "Fehler_kurz": "LaNu >=90 unzulässig",
            "Fehler_lang": "Landnutzungsart: Wert >=90 mit rückwirkendem Datenkorrekturwunsch des Waldentscheids 2012 ist unberechtigt oder falsch.",
            "Hinweis": "Die Traktecke gehört NICHT bei beiden Inventuren zum Inventurgebiet. Siehe Maske VE Zellen InvE2012 (b3_ecke.DOP) und Wa (b3f_ecke_vorkl.Wa). Es muss also keine Landnutzungsart angesprochen werden."
        },
        {
            "err": 433117,
            "ekz": "F",
            "Fehler_kurz": "LaNu unzulässig",
            "Fehler_lang": "Landnutzungsart: Wert unzulässig. Es wurde ein Wert angegeben, obwohl die Ecke kein Nichtwald ist. Bei Nichtwaldecken darf die Landnutzungsart vermerkt werden.",
            "Hinweis": "Die Traktecke gehört NICHT bei beiden Inventuren zum Inventurgebiet. Siehe Maske VE Zellen  InvE2012 (b3_ecke.DOP) und Wa (b3f_ecke_vorkl.Wa). Es muss also keine Landnutzungsart angesprochen werden."
        },
        {
            "err": 820549,
            "ekz": "F",
            "Fehler_kurz": "Bk=12  <==> Nutzungsart<19",
            "Fehler_lang": "Der Baum wurde genutzt (Bk=12), aber die Nutzungsart auf der Ecke (Formular EAL) ist kleiner gleich 19 (keine Nutzung, ...)",
            "Hinweis": "Wenn Bäume genutzt wurden, muss die Nutzungsart (Formular EAL) > 19 (... Nutzung, ...) sein. Bitte korrigieren Sie die Probebaumkennziffer Bk oder die Nutzungsart! "
        },
        {
            "err": 820536,
            "ekz": "F",
            "Fehler_kurz": "Bk  <-> BkV",
            "Fehler_lang": "Die Probebaumkennziffer 'Bk' darf nicht 11 sein",
            "Hinweis": "Die Probebaumkennziffer 11  ist für ausgeschiedene markierte Bäume oder ausgeschiedene ungültige Probebäume (z.B. außerhalb des Bestandes) zu verwenden."
        },
        {
            "err": 829992,
            "ekz": "W",
            "Fehler_kurz": "kein Baum im Hb (WZP4)",
            "Fehler_lang": "Es wurde kein Baum der WZP dem Hauptbestand zugeordnet",
            "Hinweis": null
        },
        {
            "err": 829912,
            "ekz": "F",
            "Fehler_kurz": "WZP\/ZF4-Bäume aufgenommen",
            "Fehler_lang": "Es wurden WZP\/ZF4-Bäume erfasst (Formular 'WZP'), obwohl sie lt. Waldentscheid oder Begehbarkeit nicht hätten aufgenommen werden können",
            "Hinweis": "Prüfen Sie ob der Waldentscheid (ungleich 3, 4 oder 5) oder Begehbarkeit (ungleich 1) korrekt sind. Oder überprüfen Sie die Probebaumkennziffer (Spalte 'Bk') in der WZP\/ZF4 - sie sollten weder 0 noch 1 sein, wenn Bäume nicht mehr zur CI 2017-Stichprobe gehören."
        },
        {
            "err": 829995,
            "ekz": "W",
            "Fehler_kurz": "keine Bäume im Hb",
            "Fehler_lang": "Es wurden im Formular EBS (Ansicht Bäume über 4m Höhe)  Bäume in der Hauptbestockung erfasst jedoch bei der WZP4 keine im Hauptbestand",
            "Hinweis": "Kontrollieren Sie bitte die Angaben zu Hauptbestand in EBS (Ansicht: bäume über 4m Höhe) mit die Bestandesschichtangaben in WZP4, ob bei einem Formular die Schichtangabe falsch ist"
        },
        {
            "err": 820540,
            "ekz": "F",
            "Fehler_kurz": "BK=6  <==> keine BestGrenzen",
            "Fehler_lang": "Der Baum hat die Probebaumkennziffer 6 (außerhalb des Bestandes), es ist jedoch keine Bestandesgrenze vorhanden (RAN).",
            "Hinweis": "Bitte prüfen Sie, ob in Maske RAN Bestandesgrenzen vorhanden ist oder ob die Probebaumkennziffer korrigiert werden muss"
        },
        {
            "err": 820538,
            "ekz": "F",
            "Fehler_kurz": "Bk <= 1",
            "Fehler_lang": "Die Probebaumkennziffer Bk muss größer als 1 sein, wenn der Waldentscheid ungleich 5 ist",
            "Hinweis": "Die Probebaumkennziffer Bk muss größer als 1 sein, da es sich nun um eine Blöße oder Nichtholzboden handelt "
        },
        {
            "err": 820533,
            "ekz": "F",
            "Fehler_kurz": "Bk=1111 <-> Perm<>1",
            "Fehler_lang": "Die Probebaumkennziffer Bk ist 1111='permanent markierter Hilfsbaum zum Wiederfinden der Traktecke; kein Probebaum' aber das Merkmal Perm ist ungleich 1",
            "Hinweis": "Bitte setzen Sie auch Perm auf 1 oder ändern Sie die Probebaumkennziffer Bk ungleich 1111"
        },
        {
            "err": 820911,
            "ekz": "W",
            "Fehler_kurz": "BHD_V >= BHD",
            "Fehler_lang": "Brusthöhendurchmesser bei Vorgängerinventur (Spalte 'BHD_V') grösser als \/ gleich dem bei aktueller Inventur (Spalte 'BHD')",
            "Hinweis": null
        },
        {
            "err": 820511,
            "ekz": "F",
            "Fehler_kurz": "Bk <-> Daten früher",
            "Fehler_lang": "Probebaumkennziffer (Spalte 'Bk'): ist 0 oder 8 = neuer Baum, aber Baum ist von Vorgängerinventur bekannt",
            "Hinweis": "Schon von Vorgängerinventur bekannte Bäume dürfen dieProbebaumkennziffern 0 oder 8 nicht erhalten, außer  bei Hilfsbäumen Pk=1111"
        },
        {
            "err": 820512,
            "ekz": "F",
            "Fehler_kurz": "Bk<-> Vorgängerdaten",
            "Fehler_lang": "Probebaumkennziffer (Spalte 'Bk'): Wert ungleich 0 und ungleich 8, 1111 unzulässig",
            "Hinweis": "Der Baum ist  kein Stichproben-Baum der Vorgängerinventur.  Deshalb ist der Baum NEU und die Probebaumkennziffern Bk darf nur 0 oder in Ausnahmefällen 8 oder 1111 sein."
        },
        {
            "err": 821306,
            "ekz": "F",
            "Fehler_kurz": "Baumhöhe fehlt",
            "Fehler_lang": "Baumhöhe: Wert fehlt",
            "Hinweis": "Im Plenterwald (Formular EAL, Betriebsart='2') muss von jedem Baum die Baumhöhe gemessen werden. Das gleiche gilt für Bäume mit Bestandesschicht = '0' (Spalte 'Bs')."
        },
        {
            "err": 820916,
            "ekz": "F",
            "Fehler_kurz": "Bk <-> Bhd (unmöglich)",
            "Fehler_lang": "Brusthöhendurchmesser (Spalte 'BHD'): Wert unmöglich, wenn der Baum als ausgefallen bzw. ausgeschieden gekennzeichnet (Bk={4, 9,11,12}) wurde",
            "Hinweis": "Bei (physisch) nicht mehr vorhandenen WZP4-Bäumen kann kein BHD gemessen werden. Bitte korrgieren Sie die Probebaumkennziffer Bk oder löschen Sie den BHD. "
        },
        {
            "err": 822611,
            "ekz": "F",
            "Fehler_kurz": "Bs unzulässig",
            "Fehler_lang": "Bestandesschicht (Spalte 'Bs'): Wert unzulässig (Betriebsart: Plenterwald)",
            "Hinweis": "Bs für Baum muss '0' (plenterartig) sein oder in Formular 'EAL' Betriebsart ungleich 2 (Plenterwald) setzen"
        },
        {
            "err": 822612,
            "ekz": "F",
            "Fehler_kurz": "Bs unzulässig",
            "Fehler_lang": "Bestandesschicht (Spalte 'Bs'): Wert unzulässig (Betriebsart: ungleich Plenterwald)",
            "Hinweis": "Bs für Baum muss ungleich '0' sein oder in Formular 'EAL' Betriebsart gleich 2 (Plenterwald) setzen"
        },
        {
            "err": 822613,
            "ekz": "W",
            "Fehler_kurz": "Baumhöhe zu hoch in Bestandesschicht ",
            "Fehler_lang": "Baum aus einer unteren Schicht ist höher als ein Baum aus einer oberen Schicht",
            "Hinweis": "Gemessene Baumhöhen b.z.w Bestandesschicht kontrollieren"
        },
        {
            "err": 821322,
            "ekz": "F",
            "Fehler_kurz": "Baumhöhe im Ost fehlt  ",
            "Fehler_lang": "Eine Baumhöhe für eine Baumartengruppe des Oberstandes fehlt ",
            "Hinweis": "Im Oberstand muss je Baumartengruppe (ALH, ALN, BU,DGL,EI,FI,KI,LAE,TA) mindestens eine Baumhöhe gemessen werden. "
        },
        {
            "err": 821320,
            "ekz": "F",
            "Fehler_kurz": "Baumhöhe(n) im Hb, häufigste BaGr fehlt ",
            "Fehler_lang": "Mindestens eine  Baumhöhe  der häufigsten Baumartengruppe  des Hauptbestandes fehlt ",
            "Hinweis": "Im Hauptbestand müssen in der häufigsten Baumartengruppe (ALH, ALN, BU,DGL,EI,FI,KI,LAE,TA) mindestens zwei Baumhöhen  gemessen werden."
        },
        {
            "err": 821321,
            "ekz": "F",
            "Fehler_kurz": "Baumhöhe im Ust fehlt  ",
            "Fehler_lang": "Eine Baumhöhe für Laub- oder Nadelbäume des Unterstandes fehlt ",
            "Hinweis": "Im Unterstand muss je Laub- und Nadelbäumen mindestens eine Baumhöhe gemessen werden. "
        },
        {
            "err": 821411,
            "ekz": "F",
            "Fehler_kurz": "StHöhe > Höhe",
            "Fehler_lang": "Stammhöhe größer Baumhöhe",
            "Hinweis": "Stammhöhe größer Baumhöhe"
        },
        {
            "err": 829914,
            "ekz": "F",
            "Fehler_kurz": "Grenzstammkontrolle",
            "Fehler_lang": "Grenzstammkontrolle: Grenzkreis (Spalte 'GrenzToleranz') ist größer oder gleich Horizontalentfernung (Spalte 'Hori')",
            "Hinweis": "Baum gehört zur Stichprobe;  modifizieren Sie entweder 'Bk' = 8, oder 'Bk'=1111 'Hori' oder 'BHD'."
        },
        {
            "err": 829925,
            "ekz": "W",
            "Fehler_kurz": "Höhe\/Durchmesser unwahrscheinlich",
            "Fehler_lang": "Durchmesser - Höhe: Wert unwahrscheinlich (h\/d-Verhältnis)",
            "Hinweis": "Höhe\/Durchmesser-Verhältnis > 140. Kontrollieren Sie Höhe  bzw. Höhe oder den Durchmesser)"
        },
        {
            "err": 820611,
            "ekz": "W",
            "Fehler_kurz": "s. geringe Azi-Abweichung",
            "Fehler_lang": "Azimut (Spalte 'Azi') weicht von der Vorgängerinventur ab, aber nur sehr unbedeutend (< 5 gon)",
            "Hinweis": "Sehr geringe Abweichungen der Koordinaten sollten vermieden werden"
        },
        {
            "err": 820612,
            "ekz": "W",
            "Fehler_kurz": "Azi-Abweichung",
            "Fehler_lang": "Azimut (Spalte 'Azi') weicht von der Vorgängerinventur ab  (>= 5 gon)",
            "Hinweis": "Sehr geringe Abweichungen der Koordinaten sollten vermieden werden"
        },
        {
            "err": 820711,
            "ekz": "W",
            "Fehler_kurz": "s. geringe Hori-Abweichung",
            "Fehler_lang": "Horizontalentfernung (Spalte 'Hori') weicht von der Vorgängerinventur ab, aber nur sehr gering (<10cm)",
            "Hinweis": null
        },
        {
            "err": 829921,
            "ekz": "W",
            "Fehler_kurz": "Höhenzuwachs unwahrscheinlich",
            "Fehler_lang": "Baumhöhe [dm]: Höhenzuwachs gegenüber Vorgängerinventur ungewöhnlich hoch (> 200 dm)",
            "Hinweis": "Kontrollieren Sie die Höhenmessung eventuell auch auf Messeinheitenfehler (dm, cm, mm)"
        },
        {
            "err": 820524,
            "ekz": "F",
            "Fehler_kurz": "Bk>2000",
            "Fehler_lang": "Die Probebaumkennziffer Bk darf nicht größer als 2000 sein",
            "Hinweis": "Der Baum wurde bei der Vorgängerinventur (Bk_Soll) NICHT als ausgeschieden deklariert. Die Probebaumkennziffer Bk darf deshalb NICHT größer als 2000 sein (mit 2000 sind Bäume gekennzeichnet, die bei einer früheren Inventur ausgefallen sind)."
        },
        {
            "err": 820521,
            "ekz": "F",
            "Fehler_kurz": "Bk<>Bk_Soll",
            "Fehler_lang": "Die Probebaumkennziffer Bk muss wie Bk_Soll sein",
            "Hinweis": "Der Baum wurde schon bei einer Vorgängerinventur  als ausgeschieden deklariert. Die vorinitialisierte Probebaumkennziffer Bk muss wie Bk_Soll sein."
        },
        {
            "err": 820531,
            "ekz": "W",
            "Fehler_kurz": "Bk<>\"1111\"",
            "Fehler_lang": "Die Probebaumkennziffer Bk war bei einer Vorgängerinventur ein Hilfsbaum (Pk=1111) und gehört jetzt zur Stichprobe",
            "Hinweis": "Der Baum war bei früheren Inventuren ein Hilfsbaum ohne Messwerte. Die vorinitialisierte Probebaumkennziffer Bk=\"1111\" darf deshalb nur auf Pk=0  oder Pk=8 geändert werden, wenn der Baum neu zur Stichprobe gehört."
        },
        {
            "err": 820532,
            "ekz": "W",
            "Fehler_kurz": "Bk=\"1111\"",
            "Fehler_lang": "Die Probebaumkennziffer Bk war bei einer Vorgängerinventur kein Hilfsbaum (Pk=1111) und nun ein Hilfsbaum",
            "Hinweis": "Der Baum wurde bei früheren Inventuren NICHT als (permanent markierter) Hilfsbaum interpretiert. Er ist auch heute nicht als permanent markierter Baum (Perm= '1') ohne Messwerte gekennzeichnet. Bk sollte deshalb NICHT auf \"1111\" gesetzt werden."
        },
        {
            "err": 829911,
            "ekz": "F",
            "Fehler_kurz": "Grenzstammkontrolle",
            "Fehler_lang": "Grenzstammkontrolle bei Bk=1: Grenzkreis (Spalte 'Grenz') ist kleiner als  Horizontalentfernung (Spalte 'Hori')",
            "Hinweis": "Baum gehört nicht zur Stichprobe;  modifizieren Sie entweder 'Bk'=1, 'Hori' oder 'BHD'."
        },
        {
            "err": 821318,
            "ekz": "W",
            "Fehler_kurz": "Baumhöhe<=Baumhöhe Vorgangerinventur",
            "Fehler_lang": "(jetzige) Baumhöhe [dm] ist kleiner als \/ gleich der bei der Vorgängerinventur gemessenen",
            "Hinweis": "Kontrollieren Sie Ihre Höhenmessung"
        },
        {
            "err": 820913,
            "ekz": "F",
            "Fehler_kurz": "BHD130 < 70mm",
            "Fehler_lang": "(auf 130cm Messhöhe umgerechneter) Brusthöhendurchmesser (Spalte 'Bhd130') < 70mm",
            "Hinweis": "Baum gehört nicht zur WZP-Stichprobe"
        },
        {
            "err": 821315,
            "ekz": "W",
            "Fehler_kurz": "Höhenmessbaum Vorgängerinv. nicht beachtet",
            "Fehler_lang": "Es ist ein Höhenbaum aus der Vorgängerinventur nicht  als erneuter Höhenmessbaum für den Hauptbestand verwendet worden",
            "Hinweis": "EINSICHTIGE, geeignete  (Spalte 'H-Eignung' = +), bereits bei einer Vorgängerinventur aufgenommene Höhenmessbäume (Spalte 'HöheMBV) der Hauptschicht (Bs=1) sollen wieder bevorzugt aufgenommen werden."
        },
        {
            "err": 820547,
            "ekz": "W",
            "Fehler_kurz": "Kein stehender toter Baum aufgenommen!",
            "Fehler_lang": " In TOT wurde stehendes Totholz aufgenommen jedoch kein stehender toter Baum in WZP4 mit Hori <= 500 cm!",
            "Hinweis": "Bitte prüfen Sie die WZP4 und TOT"
        },
        {
            "err": 820546,
            "ekz": "W",
            "Fehler_kurz": "Kein stehendes Totholz aufgenommen",
            "Fehler_lang": " In WZP4 wurde ein stehender toter Baum aufgenommen jedoch kein stehendes Totholz in der Maske TOT!",
            "Hinweis": "Bitte prüfen Sie die Totholzart und Horizontalentfernung"
        },
        {
            "err": 611111,
            "ekz": "W",
            "Fehler_kurz": "Abweichung Hori.Entf. =0 unzulässig",
            "Fehler_lang": "Abweichung Ecke, Horizontalentfernung zum eingemessenen GPS-Punkt: Wert 0 unzulässig",
            "Hinweis": "Wenn GPS-Art = 1 ist, dann sollte die abweichende Lage der Ecke zum eingemessenen GPS-Hilfspunkt mit Azimut und Horizontalentfernung angegeben werden (Horizontalentfernung darf nicht 0 sein)"
        },
        {
            "err": 610911,
            "ekz": "F",
            "Fehler_kurz": "GPS-Hoch widerspricht Soll-Hoch",
            "Fehler_lang": "Der Hochwert der eingemessenen GPS-Koordinate ist mehr als 1000 m von dem Soll-Hochwert entfernt",
            "Hinweis": "Das kleinste Raster bei der BWI ist 2x2 km. Abstände von mehr als 1 km zwischen Ist- und Soll-Koordinaten sind zu überprüfen. Möglicher Weise handelt es sich um einen anderen Punkt mit anderer Nummer (Tnr)"
        },
        {
            "err": 611011,
            "ekz": "W",
            "Fehler_kurz": "Abweichung Azimut oder Hori.Enf <>0",
            "Fehler_lang": "Abweichung Ecke, Azimut und Hori.Entfernung zum eingemessenen GPS-Punkt: Werte <>0",
            "Hinweis": "Wenn GPS-Art = 2 ist, dann sollte die abweichende Lage der Ecke zum eingemessenen GPS-Hilfspunkt bei Azimut und Horizontalentfernung mit 0 angegeben werden"
        },
        {
            "err": 611511,
            "ekz": "F",
            "Fehler_kurz": "Markierung unzulässig, denn Erstaufnahme",
            "Fehler_lang": "Markierung gesetzt\/gefunden: Wert unzulässig (Erstaufnahme (im Feld))",
            "Hinweis": "Die Traktecke  wird erstmals als Wald aufgenommen --> Markierung darf nur '0' oder '3' sein"
        },
        {
            "err": 611606,
            "ekz": "F",
            "Fehler_kurz": "Azimut fehlt",
            "Fehler_lang": "Azimut der Traktecken-Markierung: Wert fehlt",
            "Hinweis": null
        },
        {
            "err": 611706,
            "ekz": "F",
            "Fehler_kurz": "Entfernung fehlt",
            "Fehler_lang": "Entfernung der Traktecken-Markierung: Wert fehlt",
            "Hinweis": null
        },
        {
            "err": 611512,
            "ekz": "F",
            "Fehler_kurz": "Markierung unzulässig",
            "Fehler_lang": "Eck-Markierung gesetzt\/gefunden: Wert unzulässig, da es eine Wiederholungsaufnahme ist, siehe POSI-Vorgänger, insbesondere Perm2012 - relevant für Auswertungsperiode 2012-2022 (bei 4 dürfen Daten von 2012 und 2022 nicht miteinander verglichen werden) ",
            "Hinweis": "Die Traktecke wurde schon früher aufgenommen bzw. permanent markiert (vgl. POSI Ansicht Vorgänger) --> Markierung darf nicht '3' sein\". Bitte Markierung auf 1, 2 oder 4 setzen!"
        },
        {
            "err": 611513,
            "ekz": "F",
            "Fehler_kurz": "Markierung unzulässig",
            "Fehler_lang": "Markierung gesetzt\/gefunden: Wert unzulässig (Waldecke, aber kein Nichtholzboden)",
            "Hinweis": "Die Traktecke liegt im Wald (vgl. Startfenster Spalte Wald\/Nichtwald)  --> Markierung darf nicht '0' sein (Ausnahme bei Nichtholzboden);"
        },
        {
            "err": 619942,
            "ekz": "F",
            "Fehler_kurz": "Geländepkt. unvollständig",
            "Fehler_lang": "Der markante Geländepunkt ist unvollständig",
            "Hinweis": "es müssen Azimut UND Entfernung angegeben werden ... ODER keins von beidem"
        },
        {
            "err": 610811,
            "ekz": "F",
            "Fehler_kurz": "GPS-Rechts widerspricht Soll-Rechts",
            "Fehler_lang": "GPS-Rechts: Der Rechtswert der eingemessenen GPS-Koordinate ist mehr als 1000 m von dem Soll-Rechtswert entfernt",
            "Hinweis": "Das kleinste Raster bei der BWI ist 2x2 km. Abstände von mehr als 1 km zwischen Ist- und Soll-Koordinaten sind zu überprüfen. Möglicher Weise handelt es sich um einen anderen Punkt mit anderer Nummer (Tnr)"
        },
        {
            "err": 610611,
            "ekz": "W",
            "Fehler_kurz": "GPS-DOP überflüssig",
            "Fehler_lang": "GPS-DOP: Wert überflüssig",
            "Hinweis": "Wenn GPS-Art = 0 (keine GPS-Einmessung) ist, dann sollte auch keine GPS-DOP angegeben werden"
        },
        {
            "err": 619943,
            "ekz": "W",
            "Fehler_kurz": "GPS-Koordinaten überflüssig",
            "Fehler_lang": "GPS-Rechts, GPS-Hoch, GPS-Ost, GPS-Nord: Werte überflüssig",
            "Hinweis": "Wenn GPS-Art = 0 (keine GPS-Einmessung der Traktecke) ist, dann sollten auch keine GPS-Koordinaten angegeben werden (weder GPS-Rechts und GPS-Hoch noch GPS-Ost und GPS-Nord)"
        },
        {
            "err": 411810,
            "ekz": "F",
            "Fehler_kurz": "DatumAT unzulässig, liegt vor 15.04.2011",
            "Fehler_lang": "DatumAT:  Wert unzulässig",
            "Hinweis": "unzulässige Datumsangabe [tt.mm.jjjj]"
        },
        {
            "err": 411706,
            "ekz": "F",
            "Fehler_kurz": "AT fehlt",
            "Fehler_lang": "AT:  Wert fehlt",
            "Hinweis": null
        },
        {
            "err": 411806,
            "ekz": "F",
            "Fehler_kurz": "DatumAT fehlt",
            "Fehler_lang": "DatumAT:  Wert fehlt",
            "Hinweis": "Bei Waldtrakten muss eine Feldaufnahme erfolgen. Das Aufnahmedatum im Gelände ist dabei festzuhalten sowie der Workflow > 2 ist; siehe Formular STAT, Block Trakt"
        },
        {
            "err": 411906,
            "ekz": "W",
            "Fehler_kurz": "FertigAT fehlt",
            "Fehler_lang": "FertigAT:  Wert fehlt",
            "Hinweis": "Dieses Merkmal ergänzt das Merkmal \"Workflow\". Es kann vom Aufnahmetrupp zusätzlich OPTIONAL genutzt werden, um den Bearbeitungsstand, notwendige Aktionen oder Auffälligkeiten des Traktes zu beschreiben"
        },
        {
            "err": 412006,
            "ekz": "F",
            "Fehler_kurz": "NameAT fehlt",
            "Fehler_lang": "NameAT:  Wert fehlt",
            "Hinweis": "Bei Waldtrakten muss eine Feldaufnahme erfolgen. Der Name des Truppleiters oder Truppmitarbeiters ist dabei festzuhalten (als Bestätigung wie eine Unterschrift) sowie ein Feldaufnahmedatum gesetzt ist oder der Workflow>3 ist; siehe Formular STAT, Block Trakt"
        },
        {
            "err": 519914,
            "ekz": "W",
            "Fehler_kurz": "Startpunkt unvollständig",
            "Fehler_lang": "Es wurde mindestens eine Angabe zum Startpunkt gemacht, aber er wurde nur unvollständig beschrieben. Entweder Start_Kurz, Start_Perm, Start_Azi oder  Start_Hori fehlen ",
            "Hinweis": "Kontrollieren Sie  Start_Kurz, Start_Perm, Start_Azi oder  Start_Hori, ob eine Angabe fehlt und ergänzen diese!"
        },
        {
            "err": 519915,
            "ekz": "W",
            "Fehler_kurz": "Hilfspunkt1 unvollständig",
            "Fehler_lang": "Es wurde mindestens eine Angabe zum Hilfspunkt1 gemacht, aber er wurde nur unvollständig beschrieben. Entweder Hilf1_Kurz, Hilf1_Perm, Hilf1_Azi oder  Hilf1_Hori fehlen ",
            "Hinweis": "Kontrollieren Sie  Hilf1_Kurz, Hilf1_Perm, Hilf1_Azi oder  Hilf1_Hori, ob eine Angabe fehlt und ergänzen diese!"
        },
        {
            "err": 519916,
            "ekz": "W",
            "Fehler_kurz": "Hilfspunkt2 unvollständig",
            "Fehler_lang": "Es wurde mindestens eine Angabe zum Hilfspunkt2 gemacht, aber er wurde nur unvollständig beschrieben. Entweder Hilf2_Kurz, Hilf2_Perm, Hilf2_Azi oder  Hilf2_Hori fehlen ",
            "Hinweis": "Kontrollieren Sie  Hilf2_Kurz, Hilf2_Perm, Hilf2_Azi oder  Hilf2_Hori, ob eine Angabe fehlt und ergänzen diese!"
        },
        {
            "err": 889913,
            "ekz": "F",
            "Fehler_kurz": "zu kleinen Radius verwendet",
            "Fehler_lang": "Wenn sich im Probekreis weniger als vier Probebäume befinden, muss der Radius auf 2 m festgesetzt werden.",
            "Hinweis": "Wiederholen Sie die Aufnahme auf der Probefläche mit 2 m Radius"
        },
        {
            "err": 889911,
            "ekz": "F",
            "Fehler_kurz": "Bäume aufgenommen",
            "Fehler_lang": "Es wurden junge Bäume über 20cm Höhe im Probekreis B0 - B6 mit r=1m\/2m Radius erfasst, obwohl sie lt. Waldentscheid oder Begehbarkeit nicht hätten aufgenommen werden können",
            "Hinweis": "Prüfen Sie ob der Waldentscheid (ungleich 3 und 5) oder Begehbarkeit (ungleich 1) korrekt sind. Oder löschen Sie die Baumdaten im Formular 'JUNG' \/ 'B0-B6'"
        },
        {
            "err": 613411,
            "ekz": "F",
            "Fehler_kurz": "Schicht <-> Betriebsart",
            "Fehler_lang": "Bestandesschicht aller jungen Bäume  (Baumklasse 0 bis 6) widerspricht Betriebsart (Formular 'EAL')",
            "Hinweis": "Betriebsart=Plenterwald=2 (Formular 'EAL') , dann für Bestandesschicht von Probebäumen=0 (plenterartig)"
        },
        {
            "err": 613412,
            "ekz": "F",
            "Fehler_kurz": "Schicht <-> Betriebsart",
            "Fehler_lang": "Bestandesschicht aller jungen Bäume  (Baumklasse 0 bis 6) widerspricht Betriebsart (Formular 'EAL')",
            "Hinweis": "Betriebsart<>Plenterwald<>2 (Formular 'EAL') , dann für Bestandesschicht von Probebäumen KEINE  0 (plenterartig)"
        },
        {
            "err": 613414,
            "ekz": "F",
            "Fehler_kurz": "Schicht <-> Aufbau",
            "Fehler_lang": "Bestandesschicht aller jungen Bäume  (Baumklasse 0 bis 6) widerspricht Aufbau  (Formular 'EBS')",
            "Hinweis": "Aufbau<>mehrschichtig oder plenterartig <>6 (Formular 'EBS') , dann für Bestandesschicht von Probebäumen KEINE  0 (plenterartig)"
        },
        {
            "err": 880411,
            "ekz": "W",
            "Fehler_kurz": "Baumart in Jung aber nicht in EBS vorhanden",
            "Fehler_lang": "Baumart (Spalte 'Ba') aus Maske \"Jung\" kommt in \"EBS\" (bis 4m) nicht vor.",
            "Hinweis": "vgl. Formular 'EBS',Ansicht B0 - Bestockung (Baumart sollte dort aufgeführt sein)"
        },
        {
            "err": 613406,
            "ekz": "F",
            "Fehler_kurz": "Schicht fehlt",
            "Fehler_lang": "Bestandesschicht der Bäume < 7 cm Bhd im r=1 bzw. 2 m (Feld 'Schicht'): Wert fehlt",
            "Hinweis": null
        },
        {
            "err": 880810,
            "ekz": "W",
            "Fehler_kurz": "Wert 0 nicht sinnvoll",
            "Fehler_lang": "Anzahl Probebäume (Spalte 'Anzahl'): Wert 0 nicht sinnvoll",
            "Hinweis": "Erwartet von 1 bis 100 "
        },
        {
            "err": 731112,
            "ekz": "W",
            "Fehler_kurz": "Minimaler Totholzdurchmesser überflüssig",
            "Fehler_lang": "Durchmesser am dünnen Ende [cm]: Wert überflüssig",
            "Hinweis": "Ein Durchmesser am dünnen Ende (MinD) ist nur bei liegendem Totholz OHNE Wurzelanlauf  (Totholztyp=13) anzugeben. Bei anderem Totholz ist der 'D' (Durchmesser= MaxD) anzugeben. oder auch bei Totholz MIT Wurzelanlauf (Totholztyp=12), wenn die Länge < 130cm ist . "
        },
        {
            "err": 730512,
            "ekz": "F",
            "Fehler_kurz": "Totholztyp Wurzelstock,unterer Durchmesser < 20 cm ist zu klein",
            "Fehler_lang": "Totholztyp Wurzelstock und Durchmesser [cm] stehen im Widerspruch",
            "Hinweis": "Wurzelstöcke sollen nur aufgenommen werden, wenn Schnittfl.-durchmesser >= 20 cm ist"
        },
        {
            "err": 731106,
            "ekz": "F",
            "Fehler_kurz": "Durchmesser am dünnen Ende [cm] (Spalte 'diameter_top'): Wert fehlt",
            "Fehler_lang": "Durchmesser am dünnen Ende [cm] (Spalte 'MinD'): Wert fehlt",
            "Hinweis": "Bei liegendem Totholz OHNE Wurzelanlauf (Totholztyp=13) ist neben dem Durchmesser am dickeren Ende (MaxD) auch der Durchmesser am dünnen Ende [cm] anzugeben. Gilt auch für Totholz MIT Wurzelanlauf (Totholztyp=12), wenn die Länge < 130cm  ist"
        },
        {
            "err": 739913,
            "ekz": "W",
            "Fehler_kurz": "Totholzdimension unwahrscheinlich",
            "Fehler_lang": "Durchmesser -  Höhe: Wert unwahrscheinlich (h\/d-Verhältnis)",
            "Hinweis": "Lt Höhe\/Durchmesser-Verhältnis scheint unwahrscheinlich. Kontrollieren Sie die Maßeinheit der Angabe Länge bzw. Höhe oder den Totholztyp.  "
        },
        {
            "err": 730814,
            "ekz": "F",
            "Fehler_kurz": "Höhe unzulässig",
            "Fehler_lang": "BruchStückhöhe [dm]: Wert < 13 dm (nicht erlaubt bei stehenden Bruchstücken)",
            "Hinweis": "Wenn die Höhe < 13 dm ist, dann handelt es sich nicht um ein stehendes Bruchstück (Totholztyp=3), sondern um einen Wurzelstock (Totholztyp=4).  Kontrollieren Sie die Maßeinheit der Angabe Länge\/Höhe oder den Totholztyp."
        },
        {
            "err": 731411,
            "ekz": "F",
            "Fehler_kurz": "Rindentasche unzulässig",
            "Fehler_lang": "Rindentaschen dürfen nur bei stehendem Totholz (Totholztyp 2 u. 3) angekreuzt werden",
            "Hinweis": "Nur für stehendes totholz (Totholztyp={2,3}) muss das Vorhandensein von Rindentaschen >500 cm² mit einer Mindestbreite von 10 cm dokumentiert werden."
        },
        {
            "err": 730608,
            "ekz": "W",
            "Fehler_kurz": "Zersetzungsgrad unwahrscheinlich",
            "Fehler_lang": "Stehendes Totholz, Zersetzungsgrad  4 (stark vermodert) unwahrscheinlich",
            "Hinweis": "Totholztyp und Zersetzungsgrad überprüfen"
        },
        {
            "err": 731113,
            "ekz": "F",
            "Fehler_kurz": "Minimaler Totholzdurchmesser unwahrscheinlich",
            "Fehler_lang": "Durchmesser am dünnen Ende [cm] (Spalte ('MinD'): Wert unwahrscheinlich da größer als Durchmesser am dicken Ende [cm] (MaxD)",
            "Hinweis": "\r\nerwartet: 0 cm <= Durchmesser des Totholzstückes <= Durchmesser am dicken Ende [cm] (MaxD)."
        },
        {
            "err": 739911,
            "ekz": "F",
            "Fehler_kurz": "trotz neg. Waldentscheid/Begebarkeit Totholz aufgenommen",
            "Fehler_lang": "Es wurden Totholz erfasst (Formular 'TOT'), obwohl es lt. Waldentscheid oder Begehbarkeit nicht hätten aufgenommen werden können",
            "Hinweis": "Prüfen Sie ob der Waldentscheid (ungleich 1 und 2 und 3) oder Begehbarkeit (ungleich 1) korrekt sind. Oder löschen Sie die Totholzstücke\/Daten im Formular 'TOT'"
        },
        {
            "err": 730811,
            "ekz": "F",
            "Fehler_kurz": "Höhe Wurzelstock  unzulässig",
            "Fehler_lang": "Stockhöhe [dm]: Wert >= 13 dm (nicht erlaubt bei Wurzelstöcken)",
            "Hinweis": "Wenn die Höhe >= 13 dm ist, dann handelt es sich nicht um einen Wurzelstock (Totholztyp=4), sondern um ein stehendes Bruchstück (Totholztyp=3).  Kontrollieren Sie die Maßeinheit der Angabe Länge\/Höhe oder den Totholztyp."
        }
    ];

    const errorCodesMap = new Map(errorCodes.map(item => [item.err, item]));

    /**
     *
     * @param {string} instancePath
     * @param {string} message
     * @param {(1|2|3)} type
     * @param {any} debugInfo
     * @returns {object} error
     */
    function error(instancePath, code, debugInfo = null) { // 1 = error, 2 = warning, 3 = info
        if(!code )
            throw new Error("Code is required");
        else if(!instancePath)
            throw new Error("instancePath is required");

        return {
            instancePath: instancePath, // 'IMPORTANT: This is a placeholder',
            error: errorCodesMap.has(code) ? errorCodesMap.get(code) : `Unknown error code: ${code}`,
            //schemaPath: '#/properties/cluster_name/type',
            //keyword: 'type',
            //params: { type: 'number' },
            // message: message,
            //type: type,
            //trigger: `${className}/${functionName}`,
            debugInfo: debugInfo
        }
    }

    //const tfm_errors = class TFM_Errors{
    //
    //    errors = [];
    //
    //    get all(){
    //        return this.errors;
    //    }
    //    addAll(errors){
    //        this.errors = [ ...this.errors, ...errors];
    //    }
    //
    //    /**
    //     *
    //     * @param {string} instancePath
    //     * @param {string} message
    //     * @param {(1|2|3)} type
    //     * @param {any} debugInfo
    //     * @returns {object} error
    //     */
    //    add(instancePath, message, type = 1, debugInfo = null){
    //
    //        if(!message )
    //            throw new Error("Message is required");
    //        else if(!instancePath)
    //            throw new Error("instancePath is required");
    //    
    //        return {
    //            instancePath: instancePath,
    //            message: message,
    //            type: type,
    //            debugInfo: debugInfo
    //        }
    //    }
    //}
    //export default new tfm_errors();

    new Map(errorCodes.map(item => [item.err, item]));

    class Calc {
      /**
       * 
       * @param {*} tree 
       * @returns 
       * 
       * Ermittlung der h_Eignung siehe Ebn.Ableitungen.Berechnungen
       */
      static height_suitability = async (tree) => {
        let h_suitability = false;
        var isbifurcation = ["2", "3"].includes(tree.stem_form);  //Stammform nicht für Höhenmessung geeignet (zwiesel, kein einzelner Stamm)
        var isbroken = ["1", "2"].includes(tree.stem_breakage); //gebrochene Krone oder Spitze

        if (tree.tree_status >= 2 || isbifurcation || isbroken || tree.damage_dead || tree.stand_layer === "9") h_suitability = false;
        else h_suitability = true;

        return h_suitability;
      }
      /**
       * 
       * @param {*} arr1 
       * @param {*} arr2 
       * @param {*} key 
       * 
       * inner join zweier JSON arrays über key
       * @returns arr1
       */
      static innerJoin = (arr1, arr2, key) => {
        return arr1.map(item1 => {
          const item2 = arr2.find(item2 => item2[key] === item1[key]);
          return item2 ? { ...item1, ...item2 } : null;
        }).filter(item => item !== null);
      };


      /**
       * 
       * @param {*} dbh_height 
       * @param {*} dbh 
       * @returns grenztoleranz
       * 
       * Bestimmt Grenztoleranz aus mittlerer Messhöhe (dbh_height),  M_bhd (dbh) und  siehe BWI3_Build.bwi3gl.Ableitung.Berechnungen.cs
       */

      static grenztoleranz = (dbh_height, dbh) => {

        var grenz = 0.0;
        var tmp = 0.0;
        var Bhd130 = 0; //auf 130 cm Messhöhe korigierter bhd
        var zf = 4;  //zählfaktor

        if (dbh !== null) {
          if (dbh_height === 130) {
            tmp = dbh;
          } else {
            tmp = dbh * 1.0 * (1.0 + (0.0011 * (dbh_height - 130)));
          }
          Bhd130 = Math.round(tmp);

          grenz = Bhd130 * 5 / Math.sqrt(zf);
        }
        return grenz;
      }
      static polarkoordinatenZuKartesisch(r, theta) {
        // r: Radius (Abstand vom Ursprung)
        // theta: Winkel in Grad

        // Wandle den Winkel von Grad in Radianten um
        const thetaInRad = theta * (Math.PI / 180);

        // Berechne die kartesischen Koordinaten
        const x = r * Math.cos(thetaInRad);
        const y = r * Math.sin(thetaInRad);

        return { x, y };
      }

      /**
       * line-circle collision
       number @param {number} x1 point 1 of line
       number @param {number} y1 point 1 of line
       number @param {number} x2 point 2 of line
       number @param {number} y2 point 2 of line
       number @param {number} xc center of circle
       number @param {number} yc center of circle
       number @param {number} rc radius of circle
       */
      static lineCircle(x1, y1, x2, y2, xc, yc, rc) {
        var ac = [xc - x1, yc - y1];
        var ab = [x2 - x1, y2 - y1];
        var ab2 = Calc.dot(ab, ab);
        var acab = Calc.dot(ac, ab);
        var t = acab / ab2;
        t = (t < 0) ? 0 : t;
        t = (t > 1) ? 1 : t;
        var h = [(ab[0] * t + x1) - xc, (ab[1] * t + y1) - yc];
        var h2 = Calc.dot(h, h);
        return h2 <= rc * rc
      }
      /**
       * Punkt außerhalb des Kreises
       * @param {number} x1 point 1 of line  
       * @param {number} y1 point 1 of line
       * @param {number} xc center of circle
       * @param {number} yc center of circle
       * @param {number} rc radius of circle
       * @returns {boolean} true if point is outside circle
       * // point outside of circle
       */
      static pointOutsideCircle(x1, y1, xc, yc, rc) {
        var ac = [xc - x1, yc - y1];
        var h2 = Calc.dot(ac, ac);
        return h2 > rc * rc
      }

      /**
       * Abstand zweier Punkte
       * 
       * // distance between two points
       number @param {number[]} v1  
      */
      static dot(v1, v2) {
        return (v1[0] * v2[0]) + (v1[1] * v2[1])
      }
      
      /**
     * lineToLine helper function (to avoid circular dependencies)
     * from http://stackoverflow.com/questions/563198/how-do-you-detect-where-two-line-segments-intersect
     * @param {number} x1 first point in line 1
     * @param {number} y1 first point in line 1
     * @param {number} x2 second point in line 1
     * @param {number} y2 second point in line 1
     * @param {number} x3 first point in line 2
     * @param {number} y3 first point in line 2
     * @param {number} x4 second point in line 2
     * @param {number} y4 second point in line 2
     * @return {boolean}
     */
    static lineToLine(x1, y1, x2, y2, x3, y3, x4, y4)
    {
        var s1_x = x2 - x1;
        var s1_y = y2 - y1;
        var s2_x = x4 - x3;
        var s2_y = y4 - y3;
        var s = (-s1_y * (x1 - x3) + s1_x * (y1 - y3)) / (-s2_x * s1_y + s1_x * s2_y);
        var t = (s2_x * (y1 - y3) - s2_y * (x1 - x3)) / (-s2_x * s1_y + s1_x * s2_y);
        return s >= 0 && s <= 1 && t >= 0 && t <= 1
    }


      static className = "Calc";
    }

    class API {

        
        constructor(host, apikey) {
            this.token = null;
            this.host = host;
            this.apikey = apikey;
            this.loadedTables = {};
        }
        
       
        login = async (email, pass) => {
            const response = await fetch(`${this.host}rpc/login`, {
                method: 'POST',
                body: JSON.stringify({ email, pass }),
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const data = await response.json();
            this.token = data.token;
            return data;
        }
        getSchema = async () => {

            const response = await fetch(`${this.host}rest/v1/`, {
                method: 'GET',
                headers: {
                    //'Accept-Profile': 'private_ci2027_001',
                    'apikey': this.apikey
                },
            });
            const data = await response.json();
            return data;
        }

        lookupByAbbreviation = async (lookupTableName, abbreviation) => {
            let tableData = [];

            if(!this.loadedTables[lookupTableName]){
                
                const response = await fetch(`${this.host}rest/v1/lookup_${lookupTableName}`, {
                    method: 'GET',
                    headers: {
                        'apikey': this.apikey,
                        'Accept-Profile': 'lookup',
                        'Authentication': `Bearer ${this.apikey}`,
                    },
                });
                if (!response.ok) {
                    throw new Error(`Failed to fetch lookup table: ${lookupTableName}`);
                }
                tableData = await response.json();
                this.loadedTables[lookupTableName] = tableData;
            }else {
                tableData = this.loadedTables[lookupTableName];
            }

           // Find first row with abbreviation
            if (!tableData || tableData.length === 0) {
                throw new Error(`No data found for lookup table: ${lookupTableName}`);
            }

            return tableData.filter(row => row.code == abbreviation)[0];
            
        }
    }

    /**
     * @class Plots
     * @description Class for checking plausibility of PLOTS (No cross-plot data test possible)
     * @author Gerrit Balindt <gerrit.balindt@thuenen.de>
     */
    class Plots {

        /**
       * @function checkPlot_TOT_730608
       * @param {json} plot
       *  
       * @param {string} instancePath
       * @param {json} previous_plot
       * @returns {Array} errors
       * @author Thomas Stauber
       * 
       * Prüfung 730608: Zersetzungsgrad unwahrscheinlich
       * Stehendes Totholz, Zersetzungsgrad  4 (stark vermodert) unwahrscheinlich
       * Totholztyp und Zersetzungsgrad überprüfen
       * 
       * Fehlertext: Zersetzungsgrad unwahrscheinlich
       */
        static checkPlot_TOT_730608 = async (plot, instancePath, previous_plot = {}) => {
            let errors = [];
            let plot_name = plot.plot_name;
            let cluster_name = plot.cluster_name;
            var isforest = [3, 4, 5, 23, 24, 25].includes(plot.forest_status);   //ist  wald
            var isaccessibility = plot.accessibility == 1;  //ist  begehbar

            if (isforest && isaccessibility && plot.deadwood.length > 0) { // Totholz vorhanden
                plot.deadwood.forEach(deadwood => {
                    if (deadwood.dead_wood_type <= 3 && deadwood.decomposition === 4) { // Totholztyp stehender Stamm und Zersetzungsgrad stark vermodert

                        errors.push(error( // instancePath, message, type = 1, debugInfo = Null
                            instancePath,
                            730608, // Fehlertext aus DB holen
                            'checkPlot_TOT_730608=> plot:' + plot_name + ' cluster:' + cluster_name + ' dead_wood_type:' + deadwood.dead_wood_type + ' decomposition:' + deadwood.decomposition
                            // ecke verwenden
                        ));
                    }
                });
            }
            return errors;
        }

        /**
        * @function checkPlot_TOT_731411
        * @param {json} plot
        *  
        * @param {string} instancePath
        * @param {json} previous_plot
        * @returns {Array} errors
        * @author Thomas Stauber
        * 
        * Prüfung 731411: Rindentasche unzulässig
        * Rindentaschen dürfen nur bei stehendem Totholz (Totholztyp 2 u. 3) angekreuzt werden
        * Nur für stehendes totholz (Totholztyp={2,3}) muss das Vorhandensein von Rindentaschen >500 cm² mit einer Mindestbreite von 10 cm dokumentiert werden
        * 
        * Fehlertext: Rindentasche unzulässig
        */
        static checkPlot_TOT_731411 = async (plot, instancePath, previous_plot = {}) => {
            let errors = [];
            let plot_name = plot.plot_name;
            let cluster_name = plot.cluster_name;
            var isforest = [3, 4, 5, 23, 24, 25].includes(plot.forest_status);   //ist  wald
            var isaccessibility = plot.accessibility == 1;  //ist  begehbar

            if (isforest && isaccessibility && plot.deadwood.length > 0) { // Totholz vorhanden
                plot.deadwood.forEach(deadwood => {
                    if (deadwood.dead_wood_type !== 2 && deadwood.dead_wood_type !== 3 && deadwood.bark_pocket !== null && deadwood.bark_pocket === true) { // Totholztyp ungleich stehendes Bruchstück oder stehender Stamm und Rindentasche >0

                        errors.push(error( // instancePath, message, type = 1, debugInfo = Null
                            instancePath,
                            731411, // Fehlertext aus DB holen
                            'checkPlot_TOT_731411=> plot:' + plot_name + ' cluster:' + cluster_name + ' dead_wood_type:' + deadwood.dead_wood_type + ' bark_pocket:' + deadwood.bark_pocket
                            // ecke verwenden
                        ));
                    }
                });
            }
            return errors;
        }

        /**
        * @function checkPlot_TOT_730814
        * @param {json} plot
        *  
        * @param {string} instancePath
        * @param {json} previous_plot
        * @returns {Array} errors
        * @author Thomas Stauber
        * 
        * Prüfung 730814: Höhe unzulässig
        * BruchStückhöhe [dm]: Wert < 13 dm (nicht erlaubt bei stehenden Bruchstücken)
        * Wenn die Höhe < 13 dm ist, dann handelt es sich nicht um ein stehendes Bruchstück (Totholztyp=3), sondern um einen Wurzelstock (Totholztyp=4).
        * Kontrollieren Sie die Maßeinheit der Angabe Länge\/Höhe oder den Totholztyp.
        * 
        * Fehlertext: Höhe unzulässig
        */
        static checkPlot_TOT_730814 = async (plot, instancePath, previous_plot = {}) => {
            let errors = [];
            let plot_name = plot.plot_name;
            let cluster_name = plot.cluster_name;
            var isforest = [3, 4, 5, 23, 24, 25].includes(plot.forest_status);   //ist  wald
            var isaccessibility = plot.accessibility == 1;  //ist  begehbar

            if (isforest && isaccessibility && plot.deadwood.length > 0) { // Totholz vorhanden
                plot.deadwood.forEach(deadwood => {
                    if (deadwood.dead_wood_type === 3 && deadwood.length_height < 13) { // Totholztyp stehendes Bruchstück und Höhe < 13 dm

                        errors.push(error( // instancePath, message, type = 1, debugInfo = Null
                            instancePath,
                            730814, // Fehlertext aus DB holen
                            'checkPlot_TOT_730814=> plot:' + plot_name + ' cluster:' + cluster_name + ' length_height:' + deadwood.length_height + ' dead_wood_type:' + deadwood.dead_wood_type
                            // ecke verwenden
                        ));
                    }
                });
            }
            return errors;
        }

        /**
        * @function checkPlot_TOT_739913
        * @param {json} plot
        *  
        * @param {string} instancePath
        * @param {json} previous_plot
        * @returns {Array} errors
        * @author Thomas Stauber
        * 
        * Prüfung 739913: Totholzdimension unwahrscheinlich
        * Durchmesser -  Höhe: Wert unwahrscheinlich (h\/d-Verhältnis)
        * Lt Höhe\/Durchmesser-Verhältnis scheint unwahrscheinlich. Kontrollieren Sie die Maßeinheit der Angabe Länge bzw. Höhe oder den Totholztyp.
        * 
        * Fehlertext: Totholzdimension unwahrscheinlich
        */
        static checkPlot_TOT_739913 = async (plot, instancePath, previous_plot = {}) => {
            let errors = [];
            let plot_name = plot.plot_name;
            let cluster_name = plot.cluster_name;
            var isforest = [3, 4, 5, 23, 24, 25].includes(plot.forest_status);   //ist  wald
            var isaccessibility = plot.accessibility == 1;  //ist  begehbar

            if (isforest && isaccessibility && plot.deadwood.length > 0) { // Totholz vorhanden
                plot.deadwood.forEach(deadwood => {


                    if (deadwood.length_height !== null && deadwood.diameter_butt !== null && ((deadwood.length_height * 10) / deadwood.diameter_butt) > 140) { // h\/d-Verhältnis >10

                        errors.push(error( // instancePath, message, type = 1, debugInfo = Null
                            instancePath,
                            739913, // Fehlertext aus DB holen
                            'checkPlot_TOT_739913=> plot:' + plot_name + ' cluster:' + cluster_name + ' length_height:' + deadwood.length_height + ' diameter_butt:' + deadwood.diameter_butt
                            // ecke verwenden
                        ));
                    }
                });
            }
            return errors;
        }

        /**
        * @function checkPlot_TOT_731106
        * @param {json} plot
        *  
        * @param {string} instancePath
        * @param {json} previous_plot
        * @returns {Array} errors
        * @author Thomas Stauber
        * 
        * Prüfung 731106: MinD fehlt
        * Durchmesser am dünnen Ende [cm] (Spalte 'MinD'): Wert fehlt
        * Bei liegendem Totholz OHNE Wurzelanlauf (Totholztyp=13) ist neben dem Durchmesser am dickeren Ende (MaxD) auch der Durchmesser am dünnen Ende [cm] anzugeben.
        * Gilt auch für Totholz MIT Wurzelanlauf (Totholztyp=12), wenn die Länge < 130cm  ist
        * 
        * Fehlertext: Durchmesser am dünnen Ende [cm] (Spalte 'diameter_top'): Wert fehlt
        */
        static checkPlot_TOT_731106 = async (plot, instancePath, previous_plot = {}) => {
            let errors = [];
            let plot_name = plot.plot_name;
            let cluster_name = plot.cluster_name;
            var isforest = [3, 4, 5, 23, 24, 25].includes(plot.forest_status);   //ist  wald
            var isaccessibility = plot.accessibility == 1;  //ist  begehbar
            if (isforest && isaccessibility && plot.deadwood.length > 0) { // Totholz vorhanden
                plot.deadwood.forEach(deadwood => {
                    if (deadwood.diameter_top === null && ((deadwood.dead_wood_type === 13) || (deadwood.dead_wood_type === 12 && deadwood.length_height < 13))) {
                        // MinD fehlt bei:
                        //  Totholztyp liegendes Teilstück ohne Wurzelanlauf(13) oder bei Stammstück mit Wurzelanlauf(12) und Länge <13 dm

                        errors.push(error( // instancePath, message, type = 1, debugInfo = Null
                            instancePath,
                            731106, // Fehlertext aus DB holen
                            'checkPlot_TOT_731106=> plot:' + plot_name + ' cluster:' + cluster_name + ' deadwood_type:' + deadwood.dead_wood_type + ' diameter_top:' + deadwood.diameter_top
                            // ecke verwenden
                        ));
                    }
                });
            }
            return errors;
        }

        /**
        * @function checkPlot_TOT_730811
        * @param {json} plot
        *  
        * @param {string} instancePath
        * @param {json} previous_plot
        * @returns {Array} errors
        * @author Thomas Stauber
        * 
        * Prüfung 730811: Totholztyp Wurzelstock,  Höhe Wurzelstock  unzulässig
        * Stockhöhe [dm]: Wert >= 13 dm (nicht erlaubt bei Wurzelstöcken)
        * Wenn die Höhe >= 13 dm ist, dann handelt es sich nicht um einen Wurzelstock (Totholztyp=4), sondern um ein stehendes Bruchstück (Totholztyp=3).
        *  Kontrollieren Sie die Maßeinheit der Angabe Länge\/Höhe oder den Totholztyp.
        * 
        * Fehlertext:Totholztyp Wurzelstock,  Höhe Wurzelstock  unzulässig
        */
        static checkPlot_TOT_730811 = async (plot, instancePath, previous_plot = {}) => {
            let errors = [];
            let plot_name = plot.plot_name;
            let cluster_name = plot.cluster_name;
            var isforest = [3, 4, 5, 23, 24, 25].includes(plot.forest_status);   //ist  wald
            var isaccessibility = plot.accessibility == 1;  //ist  begehbar

            if (isforest && isaccessibility && plot.deadwood.length > 0) { // Totholz vorhanden
                plot.deadwood.forEach(deadwood => {
                    if (deadwood.dead_wood_type === 4 && deadwood.length_height >= 13) { // Totholztyp Wurzelstock und Höhe >= 13 dm

                        errors.push(error( // instancePath, message, type = 1, debugInfo = Null
                            instancePath,
                            730811, // Fehlertext aus DB holen
                            'checkPlot_TOT_730811=> plot:' + plot_name + ' cluster:' + cluster_name + ' length_height:' + deadwood.length_height
                            // ecke verwenden
                        ));
                    }
                });
            }
            return errors;
        }

        /**
        * @function checkPlot_TOT_730512
        * @param {json} plot
        *  
        * @param {string} instancePath
        * @param {json} previous_plot
        * @returns {Array} errors
        * @author Thomas Stauber
        * 
        * Prüfung 730512:  Totholztyp Wurzelstock,  Durchmesser < 20 cm ist zu klein
        * Totholztyp Wurzelstock und Durchmesser [cm] stehen im Widerspruch
        * Wurzelstöcke sollen nur aufgenommen werden, wenn Schnittfl.-durchmesser >= 20 cm ist
        * 
        * Fehlertext:Totholztyp Wurzelstock,  Durchmesser < 20 cm ist zu klein
        */
        static checkPlot_TOT_730512 = async (plot, instancePath, previous_plot = {}) => {
            let errors = [];
            let plot_name = plot.plot_name;
            let cluster_name = plot.cluster_name;
            var isforest = [3, 4, 5, 23, 24, 25].includes(plot.forest_status);   //ist  wald
            var isaccessibility = plot.accessibility == 1;  //ist  begehbar

            if (isforest && isaccessibility && plot.deadwood.length > 0) { // Totholz vorhanden
                plot.deadwood.forEach(deadwood => {
                    if (deadwood.dead_wood_type === 4 && deadwood.diameter_butt < 20) { // Totholztyp Wurzelstock und Durchmesser < 20 cm

                        errors.push(error( // instancePath, message, type = 1, debugInfo = Null
                            instancePath,
                            730512, // Fehlertext aus DB holen
                            'checkPlot_TOT_730512=> plot:' + plot_name + ' cluster:' + cluster_name + ' diameter_butt:' + deadwood.diameter_butt
                            // ecke verwenden
                        ));
                    }
                });
            }
            return errors;
        }

        /**
        * @function checkPlot_TOT_739911
        * @param {json} plot
        *  
        * @param {string} instancePath
        * @param {json} previous_plot
        * @returns {Array} errors
        * @author Thomas Stauber
        * 
        * Prüfung 739911:  trotz neg. Waldentscheid/Begebarkeit Totholz aufgenommen
        * Es wurden Totholz erfasst (Formular 'TOT'), obwohl es lt. Waldentscheid oder Begehbarkeit nicht hätten aufgenommen werden können
        * Prüfen Sie ob der Waldentscheid (ungleich 1 und 2 und 3) oder Begehbarkeit (ungleich 1) korrekt sind. Oder löschen Sie die Totholzstücke\/Daten im Formular 'TOT'
        * 
        * Fehlertext:trotz neg. Waldentscheid/Begebarkeit Totholz aufgenommen
        */
        static checkPlot_TOT_739911 = async (plot, instancePath, previous_plot = {}) => {
            let errors = [];
            let plot_name = plot.plot_name;
            let cluster_name = plot.cluster_name;
            var isforest = [3, 4, 5, 23, 24, 25].includes(plot.forest_status);   //ist  wald
            var isaccessibility = plot.accessibility == 1;  //ist  begehbar

            if ((!isforest || !isaccessibility) && plot.deadwood.length > 0) { // Totholz vorhanden aber Waldentscheid oder Begehbarkeit negativ

                errors.push(error( // instancePath, message, type = 1, debugInfo = Null
                    instancePath,
                    739911, // Fehlertext aus DB holen
                    'checkPlot_TOT_739911=> plot:' + plot_name + ' cluster:' + cluster_name
                    // ecke verwenden
                ));
            }
            return errors;
        }


        /**
        * @function checkPlot_TOT_731113
        * @param {json} plot
        *  
        * @param {string} instancePath
        * @param {json} previous_plot
        * @returns {Array} errors
        * @author Thomas Stauber
        * 
        * Prüfung 731113:  Minimaler Totholzdurchmesser unwahrscheinlich
        * Durchmesser am dünnen Ende [cm] (Spalte ('MinD'): Wert unwahrscheinlich da größer als Durchmesser am dicken Ende [cm] (MaxD)
        * erwartet: 0 cm <= Durchmesser des Totholzstückes <= Durchmesser am dicken Ende [cm] (MaxD).
        * 
        * Fehlertext:Minimaler Totholzdurchmesser unwahrscheinlich
        */
        static checkPlot_TOT_731113 = async (plot, instancePath, previous_plot = {}) => {
            let errors = [];
            let plot_name = plot.plot_name;
            let cluster_name = plot.cluster_name;
            var isforest = [3, 4, 5, 23, 24, 25].includes(plot.forest_status);   //ist  wald
            var isaccessibility = plot.accessibility == 1;  //ist  begehbar

            if (isforest && isaccessibility && plot.deadwood.length > 0) { // Totholz vorhanden
                plot.deadwood.forEach(deadwood => {
                    if (deadwood.diameter_top !== null && deadwood.diameter_top > deadwood.diameter_butt) { //Totholzstück mit Durchmesser am dünnen Ende größer als am dicken Ende

                        errors.push(error( // instancePath, message, type = 1, debugInfo = Null
                            instancePath,
                            731113, // Fehlertext aus DB holen
                            'checkPlot_TOT_731113=> plot:' + plot_name + ' cluster:' + cluster_name + ' diameter_butt:' + deadwood.diameter_butt + ' diameter_top:' + deadwood.diameter_top
                            // ecke verwenden
                        ));
                    }
                });
            }
            return errors;
        }

        /**
        * @function checkPlot_TOT_731112
        * @param {json} plot
        *  
        * @param {string} instancePath
        * @param {json} previous_plot
        * @returns {Array} errors
        * @author Thomas Stauber
        * 
        * Prüfung 731112:  Minimaler Totholzdurchmesser überflüssig
        * Durchmesser am dünnen Ende [cm]: Wert überflüssig
        * Ein Durchmesser am dünnen Ende (MinD) ist nur bei liegendem Totholz OHNE Wurzelanlauf  (Totholztyp=13) anzugeben. 
        * Bei anderem Totholz ist der 'D' (Durchmesser= MaxD) anzugeben. 
        * Oder auch bei Totholz MIT Wurzelanlauf (Totholztyp=12), wenn die Länge < 130cm ist . "
        * 
        * Fehlertext:Minimaler Totholzdurchmesser überflüssig
        */
        static checkPlot_TOT_731112 = async (plot, instancePath, previous_plot = {}) => {
            let errors = [];
            let plot_name = plot.plot_name;
            let cluster_name = plot.cluster_name;
            var isforest = [3, 4, 5, 23, 24, 25].includes(plot.forest_status);   //ist  wald
            var isaccessibility = plot.accessibility == 1;  //ist  begehbar

            if (isforest && isaccessibility && plot.deadwood.length > 0) { // Totholz vorhanden
                plot.deadwood.forEach(deadwood => {
                    if (deadwood.diameter_top !== null && ((deadwood.dead_wood_type !== 13) && (deadwood.dead_wood_type === 12 && deadwood.length_height >= 13))) {
                        // Minimaler Totholzdurchmesser überflüssig bei:
                        //  Totholztyp ungleich liegendes Teilstück ohne Wurzelanlauf(13) oder bei Stammstück mit Wurzelanlauf(12) und Länge >=13 dm

                        errors.push(error( // instancePath, message, type = 1, debugInfo = Null
                            instancePath,
                            731112, // Fehlertext aus DB holen
                            'checkPlot_TOT_731112=> plot:' + plot_name + ' cluster:' + cluster_name + ' deadwood_type:' + deadwood.deadwood_type + ' min_diameter:' + deadwood.min_diameter
                            // ecke verwenden
                        ));
                    }
                });
            }
            return errors;
        }

        /**
        * @function checkPlot_JUNG_880810
        * @param {json} plot
        *  
        * @param {string} instancePath
        * @param {json} previous_plot
        * @returns {Array} errors
        * @author Thomas Stauber
        * 
        * Prüfung 880810:  Anzahl Probebäume  < 1 oder > 100 nicht sinnvoll
        * Anzahl Probebäume (Spalte 'Anzahl'): Wert 0 nicht sinnvoll
        * Erwartet von 1 bis 100 
        * 
        * Fehlertext:Anzahl Probebäume  < 1 oder > 100 nicht sinnvoll
        */
        static checkPlot_JUNG_880810 = async (plot, instancePath, previous_plot = {}) => {
            let errors = [];
            let plot_name = plot.plot_name;
            let cluster_name = plot.cluster_name;
            var isforest = [3, 4, 5, 23, 24, 25].includes(plot.forest_status);   //ist  wald
            var isaccessibility = plot.accessibility == 1;  //ist  begehbar

            if (isforest && isaccessibility && plot.regeneration.length > 0) { // Verjüngung vorhanden
                plot.regeneration.forEach(regeneration => {
                    if (regeneration.tree_count < 1 || regeneration.tree_count > 100) { // Anzahl Probebäume außerhalb des gültigen Bereichs

                        errors.push(error( // instancePath, message, type = 1, debugInfo = Null
                            instancePath,
                            880810, // Fehlertext aus DB holen
                            'checkPlot_JUNG_880810=> plot:' + plot_name + ' cluster:' + cluster_name + ' tree_count:' + regeneration.tree_count
                            // ecke verwenden
                        ));
                    }
                });
            }
            return errors;
        }

        /**
        * @function checkPlot_JUNG_613406
        * @param {json} plot
        *  
        * @param {string} instancePath
        * @param {json} previous_plot
        * @returns {Array} errors
        * @author Thomas Stauber
        * 
        * Prüfung 613406:  Schicht fehlt
        * Bestandesschicht der Bäume < 7 cm Bhd im r=1 bzw. 2 m (Feld 'Schicht'): Wert fehlt
        * 
        * Fehlertext:Schicht fehlt
        */
        static checkPlot_JUNG_613406 = async (plot, instancePath, previous_plot = {}) => {
            let errors = [];
            let plot_name = plot.plot_name;
            let cluster_name = plot.cluster_name;
            var isforest = [3, 4, 5, 23, 24, 25].includes(plot.forest_status);   //ist  wald
            var isaccessibility = plot.accessibility == 1;  //ist  begehbar

            if (isforest && isaccessibility && plot.regeneration.length > 0 && plot.stand_layer_regeneration === null) { // Verjüngung vorhanden aber Schicht fehlt

                errors.push(error( // instancePath, message, type = 1, debugInfo = Null
                    instancePath,
                    613406, // Fehlertext aus DB holen
                    'checkPlot_JUNG_613406=> plot:' + plot_name + ' cluster:' + cluster_name
                    // ecke verwenden
                ));


            }
            return errors;
        }

        /**
        * @function checkPlot_JUNG_880411
        * @param {json} plot
        *  
        * @param {string} instancePath
        * @param {json} previous_plot
        * @returns {Array} errors
        * @author Thomas Stauber
        * 
        * Prüfung 880411:  Ba EBS <-> Ba JUNG
        * Baumart (Spalte 'Ba') aus Maske \"Jung\" kommt in \"EBS\" (bis 4m) nicht vor.
        * vgl. Formular 'EBS',Ansicht B0 - Bestockung (Baumart sollte dort aufgeführt sein)
        * 
        * Fehlertext: Ba EBS <-> Ba JUNG
        */
        static checkPlot_JUNG_880411 = async (plot, instancePath, previous_plot = {}) => {
            let errors = [];
            let plot_name = plot.plot_name;
            let cluster_name = plot.cluster_name;
            var isforest = [3, 4, 5, 23, 24, 25].includes(plot.forest_status);   //ist  wald
            var isaccessibility = plot.accessibility == 1;  //ist  begehbar

            if (isforest && isaccessibility && plot.regeneration.length > 0) { // Verjüngung vorhanden
                plot.regeneration.forEach(regeneration => {
                    if (plot.structure_lt4m.filter(structure_lt4m => structure_lt4m.tree_species === regeneration.tree_species).length === 0) { // Baumart in Jung aber nicht in EBS vorhanden

                        errors.push(error( // instancePath, message, type = 1, debugInfo = Null
                            instancePath,
                            880411, // Fehlertext aus DB holen
                            'checkPlot_JUNG_880411=> plot:' + plot_name + ' cluster:' + cluster_name + ' tree_species:' + regeneration.tree_species
                            // ecke verwenden
                        ));
                    }
                });
            }
            return errors;
        }

        /**
          * @function checkPlot_JUNG_613414
          * @param {json} plot
          *  
          * @param {string} instancePath
          * @param {json} previous_plot
          * @returns {Array} errors
          * @author Thomas Stauber
          * 
          * Prüfung 613414: Schicht <-> Aufbau
          * Bestandesschicht aller jungen Bäume  (Baumklasse 0 bis 6) widerspricht Aufbau  (Formular 'EBS')
          * Aufbau<>mehrschichtig oder plenterartig <>6 (Formular 'EBS') , dann für Bestandesschicht von Probebäumen KEINE  0 (plenterartig)
          * 
          * Fehlertext: Schicht <-> Aufbau
          */
        static checkPlot_JUNG_613414 = async (plot, instancePath, previous_plot = {}) => {
            let errors = [];
            let plot_name = plot.plot_name;
            let cluster_name = plot.cluster_name;
            var isforest = [3, 4, 5, 23, 24, 25].includes(plot.forest_status);   //ist  wald
            var isaccessibility = plot.accessibility == 1;  //ist  begehbar

            if (isforest && isaccessibility && ((plot.stand_layer_regeneration === 0 && plot.stand_structure !== 6) ||
                (plot.stand_layer_regeneration !== 0 && plot.stand_structure === 6))) { // plenterartiger Jungbestand aber Aufbau ungleich plenterartig oder umgekehrt

                errors.push(error( // instancePath, message, type = 1, debugInfo = Null
                    instancePath,
                    613414, // Fehlertext aus DB holen
                    'checkPlot_JUNG_613414=> plot:' + plot_name + ' cluster:' + cluster_name
                    // ecke verwenden
                ));
            }
            return errors;
        }
        /**
          * @function checkPlot_JUNG_613411
          * @param {json} plot
          *  
          * @param {string} instancePath
          * @param {json} previous_plot
          * @returns {Array} errors
          * @author Thomas Stauber
          * 
          * Prüfung 613411: Schicht <-> Betriebsart
          * Bestandesschicht aller jungen Bäume  (Baumklasse 0 bis 6) widerspricht Betriebsart (Formular 'EAL')
          * Betriebsart=Plenterwald=2 (Formular 'EAL') , dann für Bestandesschicht von Probebäumen=0 (plenterartig)
          * 
          * Fehlertext: Schicht <-> Betriebsart
          */
        static checkPlot_JUNG_613411 = async (plot, instancePath, previous_plot = {}) => {
            let errors = [];
            let plot_name = plot.plot_name;
            let cluster_name = plot.cluster_name;
            var isforest = [3, 4, 5, 23, 24, 25].includes(plot.forest_status);   //ist  wald
            var isaccessibility = plot.accessibility == 1;  //ist  begehbar

            if (isforest && isaccessibility && ((plot.stand_layer_regeneration === 0 && plot.management_type !== 2) ||
                (plot.stand_layer_regeneration !== 0 && plot.management_type === 2))) { // plenterartiger Jungbestand aber Betriebsart ungleich Plenterwald oder umgekehrt

                errors.push(error( // instancePath, message, type = 1, debugInfo = Null
                    instancePath,
                    613411, // Fehlertext aus DB holen
                    'checkPlot_JUNG_613411=> plot:' + plot_name + ' cluster:' + cluster_name
                    // ecke verwenden
                ));
            }
            return errors;
        }

        /**
          * @function checkPlot_JUNG_889911
          * @param {json} plot
          *  
          * @param {string} instancePath
          * @param {json} previous_plot
          * @returns {Array} errors
          * @author Thomas Stauber
          * 
          * Prüfung 889911: Bäume aufgenommen
          * Es wurden junge Bäume über 20cm Höhe im Probekreis B0 mit r=1m\/2m Radius erfasst, obwohl sie lt. Waldentscheid oder Begehbarkeit nicht hätten aufgenommen werden können
          * Prüfen Sie ob der Waldentscheid (ungleich 3 und 5) oder Begehbarkeit (ungleich 1) korrekt sind. Oder löschen Sie die Baumdaten im Formular 'JUNG' \/ 'B0'
          * 
          * Fehlertext: Bäume aufgenommen
          */
        static checkPlot_JUNG_889911 = async (plot, instancePath, previous_plot = {}) => {
            let errors = [];
            let plot_name = plot.plot_name;
            let cluster_name = plot.cluster_name;
            var isforest = [3, 4, 5, 23, 24, 25].includes(plot.forest_status);   //ist  wald
            var isaccessibility = plot.accessibility == 1;  //ist  begehbar


            if ((!isforest || !isaccessibility) && plot.regeneration.length > 0) { // Verjüngung vorhanden

                errors.push(error( // instancePath, message, type = 1, debugInfo = Null
                    instancePath,
                    889911, // Fehlertext aus DB holen
                    'checkPlot_JUNG_889911=> plot:' + plot_name + ' cluster:' + cluster_name
                    // ecke verwenden
                ));
            }
            return errors;
        }

        /**
          * @function checkPlot_JUNG_889913
          * @param {json} plot
          *  
          * @param {string} instancePath
          * @param {json} previous_plot
          * @returns {Array} errors
          * @author Thomas Stauber
          * 
          * Prüfung 889913: zu kleinen Radius verwendet
          * Wenn sich im Probekreis weniger als vier Probebäume befinden, muss der Radius auf 2 m festgesetzt werden
          * Wiederholen Sie die Aufnahme auf der Probefläche mit 2 m Radius
          * 
          * Fehlertext: zu kleinen Radius verwendet
          */
        static checkPlot_JUNG_889913 = async (plot, instancePath, previous_plot = {}) => {
            let errors = [];
            let plot_name = plot.plot_name;
            let cluster_name = plot.cluster_name;
            var isforest = [3, 4, 5, 23, 24, 25].includes(plot.forest_status);   //ist  wald
            var isaccessibility = plot.accessibility == 1;  //ist  begehbar


            let regeneration_tree_size_class0 = plot.regeneration.filter(regeneration => Number(regeneration.tree_size_class) === 0 && Number(regeneration.tree_count) < 4); // Verjüngung der Größenklasse 0

            if (isforest && isaccessibility && regeneration_tree_size_class0.length > 0) { // Verjüngung der Größenklasse 0 vorhanden
                plot.subplots_relative_position.forEach(subplot => {
                    if (subplot.parent_table === 'regeneration' && subplot.radius < 2) { // weniger als vier Probebäume und Radius auf 1m gesetzt

                        errors.push(error( // instancePath, message, type = 1, debugInfo = Null
                            instancePath,
                            889913, // Fehlertext aus DB holen
                            'checkPlot_JUNG_889913=> plot:' + plot_name + ' cluster:' + cluster_name
                            // ecke verwenden
                        ));
                    }
                });
            }



            return errors;
        }


        /**
          * @function checkPlot_POSI_611511
          * @param {json} plot
          *  
          * @param {string} instancePath
          * @param {json} previous_plot
          * @returns {Array} errors
          * @author Thomas Stauber
          * 
          * Prüfung 611511: Markierung unzulässig
          * Markierung gesetzt\/gefunden: Wert unzulässig (Erstaufnahme (im Feld))
          * Die Traktecke  wird erstmals als Wald aufgenommen --> Markierung darf nur '0' oder '3' sein
          * 
          * Fehlertext: Markierung unzulässig, denn Erstaufnahme
          */
        static checkPlot_POSI_611511 = async (plot, instancePath, previous_plot = {}) => {
            let errors = [];
            let plot_name = plot.plot_name;
            let cluster_name = plot.cluster_name;
            var isforest = [3, 4, 5, 23, 24, 25].includes(plot.forest_status);   //ist  wald
            var notwasforest = ![3, 4, 5, 23, 24, 25].includes(previous_plot.forest_status);   //ist  wald
            var notnewplotmarker = ![0, 3].includes(plot.marker_status); // ist kein Erstaufnahmeplot
            var isaccessibility = plot.accessibility == 1;  //ist  begehbar

            if (isaccessibility && isforest && notwasforest && notnewplotmarker) { // Erstaufnahme aber Markierung unzulässig

                errors.push(error( // instancePath, message, type = 1, debugInfo = Null
                    instancePath,
                    611511, // Fehlertext aus DB holen
                    'checkPlot_POSI_611511=> plot:' + plot_name + ' cluster:' + cluster_name
                    // ecke verwenden
                ));
            }
            return errors;
        }



        /**
        * @function checkPlot_POSI_611606
        * @param {json} plot
        *  
        * @param {string} instancePath
        * @param {json} previous_plot
        * @returns {Array} errors
        * @author Thomas Stauber
        * 
        * Prüfung 611606: Azimuth fehlt
        * Azimuth der Traktecken-Markierung: Wert fehlt
        * 
        * Fehlertext: Azimuth fehlt
        */
        static checkPlot_POSI_611606 = async (plot, instancePath, previous_plot = {}) => {
            let errors = [];
            let plot_name = plot.plot_name;
            let cluster_name = plot.cluster_name;
            var isforest = [3, 4, 5, 23, 24, 25].includes(plot.forest_status);   //ist  wald
            var isaccessibility = plot.accessibility == 1;  //ist  begehbar
            if (isforest && isaccessibility && plot.plot_landmark.length > 0) { //   markanter Geländepunkt vorhanden
                plot.plot_landmark.forEach(mark => {
                    if (mark.landmark_azimuth === null) { // Azimuth fehlt

                        errors.push(error( // instancePath, message, type = 1, debugInfo = Null
                            instancePath,
                            611606, // Fehlertext aus DB holen
                            'checkPlot_POSI_611606=> plot:' + plot_name + ' cluster:' + cluster_name
                            // ecke verwenden
                        ));

                    }
                });

            }
            return errors;
        }


        /**
          * @function checkPlot_POSI_611706
          * @param {json} plot
          *  
          * @param {string} instancePath
          * @param {json} previous_plot
          * @returns {Array} errors
          * @author Thomas Stauber
          * 
          * Prüfung 611706: Entfernung fehlt
          * Entfernung der Traktecken-Markierung: Wert fehlt
          * 
          * Fehlertext: Entfernung fehlt
          */
        static checkPlot_POSI_611706 = async (plot, instancePath, previous_plot = {}) => {
            let errors = [];
            let plot_name = plot.plot_name;
            let cluster_name = plot.cluster_name;
            var isforest = [3, 4, 5, 23, 24, 25].includes(plot.forest_status);   //ist  wald
            var isaccessibility = plot.accessibility == 1;  //ist  begehbar
            if (isforest && isaccessibility && plot.plot_landmark.length > 0) { //   markanter Geländepunkt vorhanden
                plot.plot_landmark.forEach(mark => {
                    if (mark.landmark_distance === null) { // Entfernung fehlt

                        errors.push(error( // instancePath, message, type = 1, debugInfo = Null
                            instancePath,
                            611706, // Fehlertext aus DB holen
                            'checkPlot_POSI_611706=> plot:' + plot_name + ' cluster:' + cluster_name
                            // ecke verwenden
                        ));

                    }
                });


            }
            return errors;
        }


        /**
         * @function checkPlot_POSI_611513
         * @param {json} plot
         *  
         * @param {string} instancePath
         * @param {json} previous_plot
         * @returns {Array} errors
         * @author Thomas Stauber
         * 
         * Prüfung 611513: Markierung unzulässig
         * Markierung gesetzt\/gefunden: Wert unzulässig (Waldecke, aber kein Nichtholzboden)
         * Die Traktecke liegt im Wald (vgl. Startfenster Spalte Wald\/Nichtwald)  --> Markierung darf nicht '0' sein (Ausnahme bei Nichtholzboden);
         * 
         * Fehlertext: Markierung unzulässig
         */
        static checkPlot_POSI_611513 = async (plot, instancePath, previous_plot = {}) => {
            let errors = [];
            let plot_name = plot.plot_name;
            let cluster_name = plot.cluster_name;
            var isNonWoodenFloor = [0, 4, 8, 9, 24].includes(plot.forest_status);   //ist  Nichtholzboden
            plot.accessibility == 1;  //ist  begehbar
            if (!isNonWoodenFloor && plot.marker_status === 0) { // kein Nichtholzboden   Markierung unzulässig

                errors.push(error( // instancePath, message, type = 1, debugInfo = Null
                    instancePath,
                    611513, // Fehlertext aus DB holen
                    'checkPlot_POSI_611513=> plot:' + plot_name + ' cluster:' + cluster_name
                    // ecke verwenden
                ));
            }
            return errors;
        }

        /**
         * @function checkPlot_POSI_619942
         * @param {json} plot
         *  
         * @param {string} instancePath
         * @param {json} previous_plot
         * @returns {Array} errors
         * @author Thomas Stauber
         * 
         * Prüfung 619942: Geländepkt. unvollständig
         * Der markante Geländepunkt ist unvollständig
         * es müssen Azimut UND Entfernung angegeben werden ... ODER keins von beidem
         * 
         * Fehlertext: Geländepkt. unvollständig
         */
        static checkPlot_POSI_619942 = async (plot, instancePath, previous_plot = {}) => {
            let errors = [];
            let plot_name = plot.plot_name;
            let cluster_name = plot.cluster_name;
            plot.plot_landmark; // markanter Geländepunkt
            // check if landmark is set
            var isforest = [3, 4, 5, 23, 24, 25].includes(plot.forest_status);   //ist  wald
            var isaccessibility = plot.accessibility == 1;  //ist  begehbar


            //  && !(plot_landmark.landmark_azimuth !== null && plot_landmark.landmark_distance !== null)

            if (isforest && isaccessibility)

                plot.plot_landmark.forEach(mark => {
                    if (!!(mark.landmark_azimuth !== null ^ mark.landmark_distance !== null)) { // markanter Geländepunkt unvollständig  
                        // xor: entweder Azimut oder Entfernung angegeben aber nicht beides oder auch nichts
                        // https://stackoverflow.com/questions/1960473/getting-the-xor-operator-in-javascript

                        errors.push(error( // instancePath, message, type = 1, debugInfo = Null
                            instancePath,
                            619942, // Fehlertext aus DB holen

                            'checkPlot_POSI_619942=> plot:' + plot_name + ' cluster:' + cluster_name + ' landmark_azimuth:' + mark.landmark_azimuth + ' landmark_distance:' + mark.landmark_distance
                            // ecke verwenden
                        ));
                    }
                });


            return errors;
        }


        /**
         * @function checkPlot_EBS_614006
         * @param {json} plot
         *  
         * @param {string} instancePath
         * @param {json} previous_plot
         * @returns {Array} errors
         * @author Thomas Stauber
         * 
         * Prüfung 614006: DG fehlt (Bäume<=4m Höhe)
         * Bestockung bis 4 m Höhe - Deckungsgrad (Feld 'DG'): Wert fehlt
         * Es wurden Baumarten für Bestockung bis 4 m Höhe aufgezählt, aber es fehlt der Deckungsgrad
         * 
         * Fehlertext: DG fehlt (Bäume<=4m Höhe)
         */
        static checkPlot_EBS_614006 = async (plot, instancePath, previous_plot = {}) => {
            let errors = [];
            let plot_name = plot.plot_name;
            let cluster_name = plot.cluster_name;
            var isforest = [3, 4, 5, 23, 24, 25].includes(plot.forest_status);   //ist  wald
            var isaccessibility = plot.accessibility == 1;  //ist  begehbar
            if (isforest && isaccessibility && plot.structure_lt4m.length > 0) { // Bäume bis 4m vorhanden
                plot.structure_lt4m.forEach(tree => {
                    if (tree.coverage === null) { // Deckungsgrad fehlt

                        errors.push(error( // instancePath, message, type = 1, debugInfo = Null
                            instancePath,
                            614006, // Fehlertext aus DB holen
                            'checkPlot_EBS_614006=> plot:' + plot_name + ' cluster:' + cluster_name + ' intkey:' + tree.intkey
                            // ecke verwenden
                        ));
                    }
                });
            }
            return errors;
        }

        /**
         * @function checkPlot_EBS_613006
         * @param {json} plot
         *  
         * @param {string} instancePath
         * @param {json} previous_plot
         * @returns {Array} errors
         * @author Thomas Stauber
         * 
         * Prüfung 613006: Phase \/ Dimensionsklasse fehlt
         * Entwicklungsphase \/ Dimensionsklasse: Wert fehlt. Die Phase der Hauptbestockung muss dann angegeben werden, wenn Bäume bis 4 m Höhe 
         * (im Probekreis r=10m) und\/oder über 4m Höhe erfasst werden (in der WZP1\/2).
         * Die Phase der Hauptbestockung ist neben der natürlichen Waldgesellschaft (Feldangabe) eine fundamentale Ausgangsgröße für den 
         * Waldlebensraumtypalgorithmus.
         * 
         * Fehlertext: Phase \/ Dimensionsklasse fehlt
         */
        static checkPlot_EBS_613006 = async (plot, instancePath, previous_plot = {}) => {
            let errors = [];
            let plot_name = plot.plot_name;

            let cluster_name = plot.cluster_name;
            var isforest = [3, 4, 5, 23, 24, 25].includes(plot.forest_status);   //ist  wald
            var isaccessibility = plot.accessibility == 1;  //ist  begehbar
            if (isforest && isaccessibility) { // plot ist Wald und begehbar
                if (plot.stand_development_phase === null && (plot.structure_lt4m.length > 0 || plot.structure_gt4m.length > 0)) { // Phase fehlt aber Bäume bis 4m vorhanden oder Phase fehlt aber Bäume über 4m vorhanden

                    errors.push(error( // instancePath, message, type = 1, debugInfo = Null
                        instancePath,
                        613006, // Fehlertext aus DB holen
                        'checkPlot_EBS_613006=> plot:' + plot_name + ' cluster:' + cluster_name
                        // ecke verwenden
                    ));



                }
            }
            return errors;
        }


        /**
         * @function checkPlot_EBS_759918
         * @param {json} plot
         *  
         * @param {string} instancePath
         * @param {json} previous_plot
         * @returns {Array} errors
         * @author Thomas Stauber
         * 
         * Prüfung 759918: Baumart: über 4 m <-> unter 4 m
         * Es wurden im Formular EBS (Ansicht Bäume über 4m Höhe) eine Baumart mit  Schicht = 9 (im Kreis R=10 berücksichtigt) erfasst, 
         * diese ist aber nicht in der Ansicht Bäume bis 4m Höhe aufgelistet
         * Kontrollieren Sie die Schichtangabe =9 bwz. ergänzen Sie die betreffende Baumart in Ansicht Bäume bis 4m Höhe
         * 
         * Fehlertext: Baumart: über 4 m <-> unter 4 m
         */
        static checkPlot_EBS_759918 = async (plot, instancePath, previous_plot = {}) => {
            let errors = [];
            let plot_name = plot.plot_name;
            let cluster_name = plot.cluster_name;
            var isforest = [3, 4, 5, 23, 24, 25].includes(plot.forest_status);   //ist  wald
            var isaccessibility = plot.accessibility == 1;  //ist  begehbar

            if (isforest && isaccessibility && plot.structure_gt4m.length > 0) { // Bäume über 4m vorhanden

                let validgt4Trees = plot.structure_gt4m.filter(structure_gt4m => Number(structure_gt4m.stock_layer) === 9); // im Kreis R=10 berücksichtigt
                validgt4Trees.forEach(tree => {
                    // Baumart in gt4m aber nicht in lt4m vorhanden
                    if (plot.structure_lt4m.filter(structure_lt4m => Number(structure_lt4m.tree_species) === tree.tree_species).length === 0) {

                        errors.push(error( // instancePath, message, type = 1, debugInfo = Null
                            instancePath,
                            759918, // Fehlertext aus DB holen
                            'checkPlot_EBS_759918=> plot:' + plot_name + ' cluster:' + cluster_name
                            // ecke verwenden
                        ));


                    }

                });
            }


            return errors;
        }


        /**
         * @function checkPlot_EBS_759917
         * @param {json} plot
         *  
         * @param {string} instancePath
         * @param {json} previous_plot
         * @returns {Array} errors
         * @author Thomas Stauber
         * 
         * Prüfung 759917: keine Bäume im Hb
         * Es wurden im Formular EBS (Ansicht Bäume über 4m Höhe) keine Bäume in der Hauptbestockung erfasst hingegen bei der WZP4 im Hauptbestand
         * Kontrollieren Sie bitte die Angaben zu Hauptbestand in EBS (Ansicht: Bäume über 4m Höhe) mit die Bestandesschichtangaben in WZP4,
         * ob bei einem Formular die Schichtangabe falsch ist
         * 
         * Fehlertext: keine Bäume im Hb
         */
        static checkPlot_EBS_759917 = async (plot, instancePath, previous_plot = {}) => {
            let errors = [];
            let plot_name = plot.plot_name;
            let cluster_name = plot.cluster_name;
            var isforest = [3, 4, 5, 23, 24, 25].includes(plot.forest_status);   //ist  wald
            var isaccessibility = plot.accessibility == 1;  //ist  begehbar

            if (isforest && isaccessibility && plot.structure_gt4m.length > 0) { // Bäume über 4m vorhanden
                let validTrees = plot.tree.filter(tree => Number(tree.stand_layer) === 1); // Bäume in Hauptbestockung

                if (plot.structure_gt4m.filter(structure_gt4m => structure_gt4m.stock_layer === 1).length === 0 && validTrees.length > 0) {
                    // keine Bäume in gt4 Hauptbestockung vorhanden aber in wzp4

                    errors.push(error( // instancePath, message, type = 1, debugInfo = Null
                        instancePath,
                        759917, // Fehlertext aus DB holen
                        'checkPlot_EBS_759917=> plot:' + plot_name + ' cluster:' + cluster_name
                        // ecke verwenden
                    ));


                }
            }
            return errors;
        }

        /**
         * @function checkPlot_EBS_759913
         * @param {json} plot
         *  
         * @param {string} instancePath
         * @param {json} previous_plot
         * @returns {Array} errors
         * @author Thomas Stauber
         * 
         * Prüfung 759913: Schicht über 4 m falsch
         * Bestockung über 4 m Höhe: Bäume dürfen nur entweder der Hauptbestockung (1) ODER der Restbestockung (3) zugeordnet werden!
         * Alle Bäume müssen der gleichen Schicht zugeordnet werden (entweder Haupt- (1) oder Restbestockung (3); Ausnahmen: 9=schon 'bis 4m Höhe' angegeben)
         * 
         * Fehlertext: Schicht über 4 m falsch
         */
        static checkPlot_EBS_759913 = async (plot, instancePath, previous_plot = {}) => {
            let errors = [];
            let plot_name = plot.plot_name;
            let cluster_name = plot.cluster_name;
            var isforest = [3, 4, 5, 23, 24, 25].includes(plot.forest_status);   //ist  wald
            var isaccessibility = plot.accessibility == 1;  //ist  begehbar
            if (isforest && isaccessibility && plot.structure_gt4m.length > 0) { // Bäume über 4m vorhanden

                // alle Bäume in der Schicht über 4m let xor = !!(1 ^ 3) || 9; // in der Schicht über 4m sind Bäume mit Schicht enweder 1 oder 3  oder 9 vorhanden
                let validTrees = plot.structure_gt4m.filter(structure_gt4m => !!(structure_gt4m.stock_layer === 1 ^ structure_gt4m.stock_layer === 3) || structure_gt4m.stock_layer === 9);


                if (validTrees.length !== plot.structure_gt4m.length) { // fehler bei unvollständiger Filterung

                    errors.push(error( // instancePath, message, type = 1, debugInfo = Null
                        instancePath,
                        759913, // Fehlertext aus DB holen
                        'checkPlot_EBS_759913=> plot:' + plot_name + ' cluster:' + cluster_name
                        // ecke verwenden
                    ));


                }
            }
            return errors;
        }

        /**
         * @function checkPlot_EBS_613911
         * @param {json} plot
         *  
         * @param {string} instancePath
         * @param {json} previous_plot
         * @returns {Array} errors
         * @author Thomas Stauber
         * 
         * Prüfung 613911: Zählfaktor überflüssig (Bäume>4m)
         * Bestockung über 4 m Höhe - Zählfaktor: Wert überflüssig
         * Es wurden keine Baumarten für Bestockung über 4 m Höhe aufgezählt, aber ein Zählfaktor angegebe
         * 
         * Fehlertext: Zählfaktor überflüssig (Bäume>4m)
         */
        static checkPlot_EBS_613911 = async (plot, instancePath, previous_plot = {}) => {
            let errors = [];
            let plot_name = plot.plot_name;
            let cluster_name = plot.cluster_name;
            var isforest = [3, 4, 5, 23, 24, 25].includes(plot.forest_status);   //ist  wald
            var isaccessibility = plot.accessibility == 1;  //ist  begehbar
            if (isforest && isaccessibility && plot.structure_gt4m.length === 0 && plot.trees_greater_4meter_basal_area_factor != null) { // Bäume über 4m vorhanden aber der Eintrag Zählfaktor existiert   
                Calc.errorText(613911); // Fehlertext aus DB holen

                errors.push(error( // instancePath, message, type = 1, debugInfo = Null
                    instancePath,
                    613911, // Fehlertext aus DB holen
                    'checkPlot_EBS_613911=> plot:' + plot_name + ' cluster:' + cluster_name
                    // ecke verwenden
                ));


            }
            return errors;
        }



        /**
         * @function checkPlot_EBS_759916
         * @param {json} plot
         *  
         * @param {string} instancePath
         * @param {json} previous_plot
         * @returns {Array} errors
         * @author Thomas Stauber
         * 
         * Prüfung 759916: Baumart WZP\/ZF4 <-> WZP\/ZF1o.2
         * Es wurden Baumarten in der Winkelzählprobe ZF=4  erfasst, die in der Winkelzählprobe ZF1 bzw. 2 nicht erfasst wurden
         * Baumarten, die in der WZP\/ZF4 erfasst worden sind (Formular 'WZP4', Bäume mit Bk=0 oder 1), müssen auch in der WZP\/ZF1o.2 erfasst werden 
         * (Formular 'EBS', Bäume über 4 m Höhe)
         * 
         * Fehlertext: Ba: WZP\/ZF4 <-> WZP\/ZF1o.2
         */
        static checkPlot_EBS_759916 = async (plot, instancePath, previous_plot = {}) => {
            let errors = [];
            let plot_name = plot.plot_name;
            let cluster_name = plot.cluster_name;
            var isforest = [3, 4, 5, 23, 24, 25].includes(plot.forest_status);   //ist  wald
            var isaccessibility = plot.accessibility == 1;  //ist  begehbar
            if (isforest && isaccessibility && plot.structure_gt4m.length > 0) { // Bäume über 4m vorhanden
                // Baumarten in WZP/ZF4 mit Probebaumkennziffer Bk= 0 oder 1
                let validTrees = plot.tree.filter(tree => Number(tree.tree_status) < 2);
                // count by art vaid trees
                // snippet from https://stackoverflow.com/questions/44387647/group-and-count-values-in-an-array
                var counts = validTrees.reduce((group, item) => {
                    var tree_species = item.tree_species;
                    if (!group.hasOwnProperty(tree_species)) {
                        group[tree_species] = 0;
                    }
                    //count measured heights
                    if (item.tree_height !== null) group[tree_species]++;
                    return group;
                }
                    , {} //empty init object of group to reduce into
                );

                Object.keys(counts).forEach(key => {
                    //alle Baumarten aus wzp4 müssen in wzp1o2 vorhanden sein
                    let validTrees1 = plot.structure_gt4m.filter(structure_gt4m => Number(structure_gt4m.tree_species) === Number(key));
                    if (validTrees1.length == 0) {

                        errors.push(error( // instancePath, message, type = 1, debugInfo = Null
                            instancePath,
                            759916, // Fehlertext aus DB holen
                            'checkPlot_EBS_759916=> plot:' + plot_name + ' cluster:' + cluster_name
                            // ecke verwenden
                        ));


                    }
                });


            }
            return errors;
        }

        /**
         * @function checkPlot_EBS_759914
         * @param {json} plot
         *  
         * @param {string} instancePath
         * @param {json} previous_plot
         * @returns {Array} errors
         * @author Thomas Stauber
         * 
         * Prüfung 759914: Anzahl WZP\/ZF4 <-> WZP\/ZF1o.2
         * Es wurden weniger Bäume je Baumart in der Winkelzählprobe ZF1 bzw. 2 erfasst als in der Winkelzählprobe ZF4
         * Bäume, die in der WZP\/ZF4 erfasst worden sind (Formular 'WZP4', Bäume mit Bk=0 oder 1), müssen auch in der WZP\/ZF1o.2 erfasst werden 
         * (Formular 'EBS', Bäume über 4 m Höhe)
         * 
         * Fehlertext: Anzahl WZP\/ZF4 <-> WZP\/ZF1o.2
         */
        static checkPlot_EBS_759914 = async (plot, instancePath, previous_plot = {}) => {
            let errors = [];
            let plot_name = plot.plot_name;
            let cluster_name = plot.cluster_name;
            var isforest = [3, 4, 5, 23, 24, 25].includes(plot.forest_status);   //ist  wald
            var isaccessibility = plot.accessibility == 1;  //ist  begehbar
            if (isforest && isaccessibility && plot.structure_gt4m.length > 0) { // Bäume über 4m vorhanden
                // Anzahl der Bäume über 4m mit Probebaumkennziffer Bk= 0 oder 1
                let validTrees = plot.tree.filter(tree => Number(tree.tree_status) < 2);
                // count by art vaid trees
                // snippet from https://stackoverflow.com/questions/44387647/group-and-count-values-in-an-array
                var counts = validTrees.reduce((group, item) => {
                    var tree_species = item.tree_species;
                    if (!group.hasOwnProperty(tree_species)) {
                        group[tree_species] = 0;
                    }
                    //count measured heights
                    if (item.tree_height !== null) group[tree_species]++;
                    return group;
                }
                    , {} //empty init object of group to reduce into
                );

                for (let tree_gt4m of plot.structure_gt4m) {
                    if (counts[tree_gt4m.tree_species] !== undefined) { // Baumart in WZP/ZF4 vorhanden
                        if (counts[tree_gt4m.tree_species] > tree_gt4m.count) { // Anzahl der Bäume über 4m kleiner  Anzahl in WZP/ZF4

                            errors.push(error( // instancePath, message, type = 1, debugInfo = Null
                                instancePath,
                                759914, // Fehlertext aus DB holen
                                'checkPlot_EBS_759914=> plot:' + plot_name + ' cluster:' + cluster_name
                                // ecke verwenden
                            ));


                        }
                    }

                }

            }
            return errors;
        }


        /**
         * @function checkPlot_EBS_613912
         * @param {json} plot
         *  
         * @param {string} instancePath
         * @param {json} previous_plot
         * @returns {Array} errors
         * @author Thomas Stauber
         * 
         * Prüfung 613912: Zählfaktor 2 für Bäume > 4 m Höhe	
         * Bestockung: Es wurden mit einem falschen Zählfaktor für Bäume über 4 m Höhe gearbeitet.
         * Zählfaktor 2 ist nur erlaubt, wenn in der WZP\/ZF4 mehr als 10 Bäume (mit Probebaumkennziffer Bk= 0 oder 1) aufgenommen worden sind. Ansonsten ist mit Zählfaktor 1 zu arbeiten
         * 
         * Fehlertext: Zählfaktor 2 für Bäume > 4 m Höhe
         */
        static checkPlot_EBS_613912 = async (plot, instancePath, previous_plot = {}) => {
            let errors = [];
            let plot_name = plot.plot_name;
            let cluster_name = plot.cluster_name;
            var isforest = [3, 4, 5, 23, 24, 25].includes(plot.forest_status);   //ist  wald
            var isaccessibility = plot.accessibility == 1;  //ist  begehbar
            if (isforest && isaccessibility && plot.structure_gt4m.length > 0 && plot.trees_greater_4meter_basal_area_factor === 2) { // Bäume über 4m vorhanden aber Zählfaktor=2
                // Anzahl der Bäume über 4m mit Probebaumkennziffer Bk= 0 oder 1
                let validTrees = plot.tree.filter(tree => Number(tree.tree_status) < 2);

                if (validTrees.length <= 10) { // Anzahl der Bäume über 4m kleiner gleich 10

                    errors.push(error( // instancePath, message, type = 1, debugInfo = Null
                        instancePath,
                        613912, // Fehlertext aus DB holen
                        'checkPlot_EBS_613912=> plot:' + plot_name + ' cluster:' + cluster_name
                        // ecke verwenden
                    ));


                }
            }
            return errors;
        }


        /**
        * @function checkPlot_EBS_612812
        * @param {json} plot
        *  
        * @param {string} instancePath
        * @param {json} previous_plot
        * @returns {Array} errors
        * @author Thomas Stauber
        * 
        * Prüfung 612812:	Alter <-> Betriebsart
        * Widerspruch zwischen Alter (Bestockung) und Betriebsart: Bei Betriebsart Plenterwald (2) darf kein Alter angegeben werden
        * Bei Betriebsart ungleich 2 (Plenterwald) muss das Alter > 7 (=Mindestalter) sein; Für Betriebsart Plenterwald ist keine Altersangabe zulässig (alternativ zu keine Angabe)
        * 
        * Fehlertext: Alter <-> Betriebsart
        */
        static checkPlot_EBS_612812 = async (plot, instancePath, previous_plot = {}) => {
            let errors = [];
            let plot_name = plot.plot_name;
            let cluster_name = plot.cluster_name;
            var isforest = [3, 4, 5, 23, 24, 25].includes(plot.forest_status);   //ist  wald
            var isaccessibility = plot.accessibility == 1;  //ist  begehbar

            if (isforest && isaccessibility &&
                (plot.management_type === 2 && plot.stand_age !== null) || (plot.management_type !== 2 && plot.stand_age <= 7)) {
                // Plenterwald aber Alter angegeben oder kein Plenterwald und kleiner mindestalter 7

                errors.push(error( // instancePath, message, type = 1, debugInfo = Null
                    instancePath,
                    612812, // Fehlertext aus DB holen
                    'checkPlot_EBS_612812=> plot:' + plot_name + ' cluster:' + cluster_name
                    // ecke verwenden
                ));


            }
            return errors;
        }


        /**
         * @function checkPlot_EBS_612705
         * @param {json} plot
         *  
         * @param {string} instancePath
         * @param {json} previous_plot
         * @returns {Array} errors
         * @author Thomas Stauber
         * 
         * Prüfung 612705:	Hauptbestockung ,Aufbau, Alter unwahrsch
         * Hauptbestockung im 10 m Kreis bei Aufbau =2 (zweischichtig) und Alter >= 50 ist unwahrscheinlich
         * Überprüfen Sie Alter und Aufbau für Bäume  <4 m
         * 
         * Fehlertext: Hauptbestockung ,Aufbau, Alter unwahrsch
         */
        static checkPlot_EBS_612705 = async (plot, instancePath, previous_plot = {}) => {
            let errors = [];
            let plot_name = plot.plot_name;
            let cluster_name = plot.cluster_name;
            var isforest = [3, 4, 5, 23, 24, 25].includes(plot.forest_status);   //ist  wald
            var isaccessibility = plot.accessibility == 1;  //ist  begehbar
            if (isforest && isaccessibility && plot.stand_structure === 2 && plot.trees_less_4meter_layer === 1 && plot.stand_age >= 50) { // zweischichtig und Alter >=50

                errors.push(error( // instancePath, message, type = 1, debugInfo = Null
                    instancePath,
                    612705, // Fehlertext aus DB holen
                    'checkPlot_EBS_612705=> plot:' + plot_name + ' cluster:' + cluster_name
                    // ecke verwenden
                ));

            }
            return errors;
        }


        /**
         * @function checkPlot_EBS_612711
         * @param {json} plot
         *  
         * @param {string} instancePath
         *  @param {json} previous_plot
         * @returns {Array} errors
         * @author Thomas Stauber
         * 
         * Prüfung 612711:	Aufbau <-> Betriebsart
         * Widerspruch zwischen Aufbau (Bestockung) und Betriebsart: Wert unzulässig
         * Bei Betriebsart 2 (Plenterwald) wird Aufbau = 6 (mehrschichtig oder plenterartig) erwartet
         * 
         * Fehlertext: Aufbau <-> Betriebsart
         */
        static checkPlot_EBS_612711 = async (plot, instancePath, previous_plot = {}) => {
            let errors = [];
            let plot_name = plot.plot_name;
            let cluster_name = plot.cluster_name;
            var isforest = [3, 4, 5, 23, 24, 25].includes(plot.forest_status);   //ist  wald
            var isaccessibility = plot.accessibility == 1;  //ist  begehbar
            if (isforest && isaccessibility && plot.stand_structure <= 1 && plot.management_type === 2) { // Plenterwald aber Aufbau kleiner gleich 1

                errors.push(error( // instancePath, message, type = 1, debugInfo = Null
                    instancePath,
                    612711, // Fehlertext aus DB holen
                    'checkPlot_EBS_612711=> plot:' + plot_name + ' cluster:' + cluster_name
                    // ecke verwenden
                ));


            }
            return errors;
        }


        /**
         * @function checkPlot_EBS_750511
         * @param {json} plot
         *  
         * @param {string} instancePath
         *  @param {json} previous_plot
         * @returns {Array} errors
         * @author Thomas Stauber
         * 
         * Prüfung 750511:	2 mal Hauptbestockung vergeben (<4m u. >4m)
         * Bestockung über 4 m Höhe - Schicht: Wert (Hauptbestockung) steht im Widerspruch zur Schicht aller Bäume bis 4m Höhe (auch Hauptbestockung)
         * Hauptbestockung darf ENTWEDER für die Bestockung bis 4m Höhe ODER für Bäume über 4m Höhe angegeben werden.
         * 
         * Fehlertext: 2 mal Hauptbestockung vergeben (<4m u. >4m)
         */
        static checkPlot_EBS_750511 = async (plot, instancePath, previous_plot = {}) => {
            let errors = [];
            let plot_name = plot.plot_name;
            let cluster_name = plot.cluster_name;
            var isforest = [3, 4, 5, 23, 24, 25].includes(plot.forest_status);   //ist  wald
            var isaccessibility = plot.accessibility == 1;  //ist  begehbar


            if (isforest && isaccessibility && plot.structure_gt4m.length > 0 && plot.structure_lt4m.length > 0) { // Bäume bis 4m und Bäume über 4m vorhanden
                if (plot.structure_gt4m.filter(structure_gt4m => structure_gt4m.stock_layer === 1).length > 0 && plot.trees_less_4meter_layer === 1) { // Hauptbestockung 2 mal vergeben

                    errors.push(error( // instancePath, message, type = 1, debugInfo = Null
                        instancePath,
                        750511, // Fehlertext aus DB holen
                        'checkPlot_EBS_750511=> plot:' + plot_name + ' cluster:' + cluster_name
                        // ecke verwenden
                    ));


                }
            }


            return errors;
        }


        /**
         * @function checkPlot_EBS_740413
         * @param {json} plot
         *  
         * @param {string} instancePath
         *  @param {json} previous_plot
         * @returns {Array} errors
         * @author Thomas Stauber
         * 
         * Prüfung 740413:	SummeAnteile <> 10 (Bäume<=4m)
         * Bestockung bis 4 m Höhe - Die Summe der Baumartenanteile  ist ungleich  10 (100%)
         * Anteile der Baumarten (bis 4m Höhe) müssen sich zu 10 addieren.
         * 
         * Fehlertext: SummeAnteile <> 10 (Bäume<=4m)
         */
        static checkPlot_EBS_740413 = async (plot, instancePath, previous_plot = {}) => {
            let errors = [];
            let plot_name = plot.plot_name;
            let cluster_name = plot.cluster_name;
            var isforest = [3, 4, 5, 23, 24, 25].includes(plot.forest_status);   //ist  wald
            var isaccessibility = plot.accessibility == 1;  //ist  begehbar


            if (isforest && isaccessibility && plot.structure_lt4m.length > 0) { // Bäume bis 4m vorhanden
                let sum_tree_lt4m = 0;
                for (let tree_lt4m of plot.structure_lt4m) {
                    sum_tree_lt4m += tree_lt4m.coverage; // Anteil der Bäume bis 4m aufsummieren

                }
                if (sum_tree_lt4m !== 10) { // Summe der Anteile ungleich 10

                    errors.push(error( // instancePath, message, type = 1, debugInfo = Null
                        instancePath,
                        740413, // Fehlertext aus DB holen
                        'checkPlot_EBS_740413=> plot:' + plot_name + ' cluster:' + cluster_name
                        // ecke verwenden
                    ));


                }

            }


            return errors;
        }

        /**
         * @function checkPlot_EBS_759991
         * @param {json} plot
         *  
         * @param {string} instancePath
         *  @param {json} previous_plot
         * @returns {Array} errors
         * @author Thomas Stauber
         * 
         * Prüfung 759991:	keine Hauptbestockung
         * Es wurden keine Bäume der Hauptbestockung (Felder 'Schicht') zugeordnet
         * Schicht=1 (Hauptbestockung) weder für alle Bäume bis 4m Höhe (in Tabelle b3v_ecke_feld.SchiLE4_Schi) noch für einzelne\/alle Bäume über 4m Höhe (in Tabelle b3v_lt4m_ba.Schi) angegeben
         * 
         * Fehlertext: keine Hauptbestockung
         */

        static checkPlot_EBS_759991 = async (plot, instancePath, previous_plot = {}) => {
            let errors = [];
            let plot_name = plot.plot_name;
            let cluster_name = plot.cluster_name;
            var isforest = [3, 4, 5, 23, 24, 25].includes(plot.forest_status);   //ist  wald
            var isaccessibility = plot.accessibility == 1;  //ist  begehbar


            if (isforest && isaccessibility) { // plot ist Wald und begehbar
                // keine Bäume größer 4m  in Hauptbestockung vorhanden oder keine Bäume kleiner 4m in Hauptbestockung vorhanden
                if (!(plot.structure_gt4m.length > 0 && plot.structure_gt4m.filter(structure_gt4m => structure_gt4m.stock_layer === 1).length > 0 || (plot.structure_lt4m.length > 0 && plot.trees_less_4meter_layer === 1))) {

                    errors.push(error( // instancePath, message, type = 1, debugInfo = Null
                        instancePath,
                        759991, // Fehlertext aus DB holen
                        'checkPlot_EBS_759991=> plot:' + plot_name + ' cluster:' + cluster_name
                        // ecke verwenden
                    ));

                }
            }


            return errors;
        }


        /**
        * @function checkPlot_EBS_749911
        * @param {json} plot
        *  
        * @param {string} instancePath
        *  @param {json} previous_plot
        * @returns {Array} errors
        * @author Thomas Stauber
        * 
        * Prüfung 749911:	Bäume bis 4m  oder  größer 4m Höhe aufgenommen
        * Es wurden Bäume bis 4 m oder  größer 4m Höhe erfasst (Formular 'EBS'), obwohl sie lt. Waldentscheid oder Begehbarkeit nicht hätten aufgenommen werden können \/sollen
        * Prüfen Sie ob der Waldentscheid (ungleich 5 und 3) oder Begehbarkeit (ungleich 1) korrekt sind. Oder löschen Sie die Bäume\/Daten im Formular 'EBS', Block links 'Bäume bis 4 m Höhe'
        * 
        * Fehlertext: Bäume bis 4m  oder  größer 4m Höhe aufgenommen
        */
        static checkPlot_EBS_749911 = async (plot, instancePath, previous_plot = {}) => {
            let errors = [];
            let plot_name = plot.plot_name;
            let cluster_name = plot.cluster_name;
            var isforest = [3, 4, 5, 23, 24, 25].includes(plot.forest_status);   //ist  wald
            var isaccessibility = plot.accessibility == 1;  //ist  begehbar


            if ((!isforest || !isaccessibility) && (plot.structure_lt4m.length > 0 || plot.structure_gt4m.length > 0)) { // Bäume bis 4m vorhanden aber der Eintrag Alter fehlt

                errors.push(error( // instancePath, message, type = 1, debugInfo = Null
                    instancePath,
                    749911, // Fehlertext aus DB holen
                    'checkPlot_EBS_749911=> plot:' + plot_name + ' cluster:' + cluster_name
                    // ecke verwenden
                ));

            }


            return errors;
        }

        /**
        * @function checkPlot_EBS_612806
        * @param {json} plot
        *  
        * @param {string} instancePath
        *  @param {json} previous_plot
        * @returns {Array} errors
        * @author Thomas Stauber
        * 
        * Prüfung 612806:	Alter fehlt
        * Alter: Wert fehlt.  Das Bestockungsalter muss dann angegeben werden, wenn Bäume bis 4 m Höhe (im Probekreis r=10m) und\/oder über 4m Höhe erfasst werden (in der WZP1\/2).
        * Das Bestockungsalter darf nur dann fehlen, wenn Betriebsart=2=Plenterwald ist Siehe Formular EAL
        * 
        * Fehlertext: Alter fehlt
        */

        static checkPlot_EBS_612806 = async (plot, instancePath, previous_plot = {}) => {
            let errors = [];
            let plot_name = plot.plot_name;
            let cluster_name = plot.cluster_name;
            var isforest = [3, 4, 5, 23, 24, 25].includes(plot.forest_status);   //ist  wald
            var isaccessibility = plot.accessibility == 1;  //ist  begehbar


            if (isforest && isaccessibility && (plot.structure_lt4m.length > 0 || plot.structure_gt4m.length > 0) && plot.stand_age === null && plot.management_type !== 2) { // Bäume bis 4m vorhanden aber der Eintrag Alter fehlt

                errors.push(error( // instancePath, message, type = 1, debugInfo = Null
                    instancePath,
                    612806, // Fehlertext aus DB holen
                    'checkPlot_EBS_612806=> plot:' + plot_name + ' cluster:' + cluster_name
                    // ecke verwenden
                ));

            }


            return errors;
        }


        /**
         * @function checkPlot_EBS_612706
         * @param {json} plot
         *  
         * @param {string} instancePath
         *  @param {json} previous_plot
         * @returns {Array} errors
         * @author Thomas Stauber
         * 
         * Prüfung 612706:	Aufbau fehlt
         * Aufbau (Bestockung): Wert fehlt.  Der Aufbau der Bestockung muss dann angegeben werden,
         * wenn Bäume bis 4 m Höhe (im Probekreis r=10m) und\/oder über 4m Höhe erfasst werden (in der WZP1\/2).
         * 
         * Fehlertext: Aufbau fehlt
         */
        static checkPlot_EBS_612706 = async (plot, instancePath, previous_plot = {}) => {
            let errors = [];
            let plot_name = plot.plot_name;
            let cluster_name = plot.cluster_name;
            var isforest = [3, 4, 5, 23, 24, 25].includes(plot.forest_status);   //ist  wald
            var isaccessibility = plot.accessibility == 1;  //ist  begehbar


            if (isforest && isaccessibility && (plot.structure_lt4m.length > 0 || plot.structure_gt4m.length > 0) && plot.stand_structure === null) { // Bäume bis 4m vorhanden aber der Eintrag Aufbau fehlt

                errors.push(error( // instancePath, message, type = 1, debugInfo = Null
                    instancePath,
                    612706, // Fehlertext aus DB holen
                    'checkPlot_EBS_612706=> plot:' + plot_name + ' cluster:' + cluster_name
                    // ecke verwenden
                ));

            }


            return errors;
        }


        /**
         * @function checkPlot_EBS_750610
         * @param {json} plot
         *  
         * @param {string} instancePath
         *  @param {json} previous_plot
         * @returns {Array} errors
         * @author Thomas Stauber
         * 
         * Prüfung 750610:	Summe Anzahl zu hoch?
         * Die Summe von Anzahl ist >=50 bei ZF=1 bzw. >=30 bei ZF=2
         * Kontrollieren Sie ob nicht zuviele Bäume gemessen wurde, bzw. ein Tippfehler bei Anzahl vorhanden ist
         * 
         * Fehlertext: Summe Anzahl zu hoch?
         */
        static checkPlot_EBS_750610 = async (plot, instancePath, previous_plot = {}) => {
            let errors = [];
            let plot_name = plot.plot_name;
            let cluster_name = plot.cluster_name;
            var isforest = [3, 4, 5, 23, 24, 25].includes(plot.forest_status);   //ist  wald
            var isaccessibility = plot.accessibility == 1;  //ist  begehbar


            if (isforest && isaccessibility && plot.structure_gt4m.length > 0) {
                let count_tree_gt4m = 0;
                for (let tree_gt4m of plot.structure_gt4m) {
                    count_tree_gt4m += tree_gt4m.count; // Anzahl der Bäume über 4m aufsummieren

                }
                if ((plot.trees_greater_4meter_basal_area_factor === 1 && count_tree_gt4m >= 50) || (plot.trees_greater_4meter_basal_area_factor === 2 && count_tree_gt4m >= 30)) { // Zählfaktor=1 und Anzahl >=50 oder Zählfaktor=2 und Anzahl >=30

                    errors.push(error( // instancePath, message, type = 1, debugInfo = Null
                        instancePath,
                        750610, // Fehlertext aus DB holen
                        'checkPlot_EBS_750610=> plot:' + plot_name + ' cluster:' + cluster_name
                        // ecke verwenden
                    ));


                }

            }


            return errors;
        }

        /**
         * @function checkPlot_EBS_613906
         * @param {json} plot
         *  
         * @param {string} instancePath
         *  @param {json} previous_plot
         * @returns {Array} errors
         * @author Thomas Stauber
         * 
         * Prüfung 613906:	Zählfaktor fehlt (Bäume>4 m)
         * Bestockung über 4 m Höhe - Zählfaktor: Wert fehlt
         * Es wurden Baumarten für Bestockung über 4 m Höhe aufgezählt, aber es fehlt der Zählfaktor
         * 
         * Fehlertext: Zählfaktor fehlt (Bäume>4 m)
         */
        static checkPlot_EBS_613906 = async (plot, instancePath, previous_plot = {}) => {
            let errors = [];
            let plot_name = plot.plot_name;
            let cluster_name = plot.cluster_name;
            var isforest = [3, 4, 5, 23, 24, 25].includes(plot.forest_status);   //ist  wald
            var isaccessibility = plot.accessibility == 1;  //ist  begehbar


            if (isforest && isaccessibility && plot.structure_gt4m.length > 0 && plot.trees_greater_4meter_basal_area_factor === null) { // bäume über 4m vorhanden aber der Eintrag Zählfaktor fehlt

                errors.push(error( // instancePath, message, type = 1, debugInfo = Null
                    instancePath,
                    613906, // Fehlertext aus DB holen
                    'checkPlot_EBS_613906=> plot:' + plot_name + ' cluster:' + cluster_name
                    // ecke verwenden
                ));



            }


            return errors;
        }

        /**
         * @function checkPlot_EBS_613806
         * @param {json} plot
         *  
         * @param {string} instancePath
         *  @param {json} previous_plot
         * @returns {Array} errors
         * @author Thomas Stauber
         * 
         * Prüfung 613806:	Spiegelungsart fehlt (Bäume>4m)
         * Bestockung über 4 m Höhe - Art der Spiegelung: Wert fehlt
         * Es wurden Baumarten für Bestockung über 4 m Höhe aufgezählt, aber es fehlt die Art der Spiegelung. Wenn nicht gespiegelt wurde, dann ist 0 anzugeben
         * 
         * Fehlertext: Spiegelungsart fehlt (Bäume>4m)
         */
        static checkPlot_EBS_613806 = async (plot, instancePath, previous_plot = {}) => {
            let errors = [];
            let plot_name = plot.plot_name;
            let cluster_name = plot.cluster_name;
            var isforest = [3, 4, 5, 23, 24, 25].includes(plot.forest_status);   //ist  wald
            var isaccessibility = plot.accessibility == 1;  //ist  begehbar


            if (isforest && isaccessibility && plot.structure_gt4m.length > 0 && plot.trees_greater_4meter_mirrored === null) { // bäume über 4m vorhanden aber der Eintrag GESPIEGELT fehlt

                errors.push(error( // instancePath, message, type = 1, debugInfo = Null
                    instancePath,
                    613806, // Fehlertext aus DB holen
                    'checkPlot_EBS_613806=> plot:' + plot_name + ' cluster:' + cluster_name
                    // ecke verwenden
                ));



            }


            return errors;
        }



        /**
         * @function checkPlot_EBS_612712
         * @param {json} plot
         *  
         * @param {string} instancePath
         *  @param {json} previous_plot
         * @returns {Array} errors
         * @author Thomas Stauber
         * 
         * Prüfung 612712:	Aufbau plot.stand_structure widerspricht Bestockung
         * Aufbau=1 (einschichtig) widerspricht der Bestockungsaufnahme
         * Überprüfen Sie ob tatsächlich sowohl Bäume bis 4 m als auch Bäume über 4 m vorhanden sind oder ob der Aufbau falsch angegeben wurde!
         * 
         * Fehlertext: Aufbau widerspricht Bestockung
         */
        static checkPlot_EBS_612712 = async (plot, instancePath, previous_plot = {}) => {
            let errors = [];
            let plot_name = plot.plot_name;
            let cluster_name = plot.cluster_name;
            var isforest = [3, 4, 5, 23, 24, 25].includes(plot.forest_status);   //ist  wald
            var isaccessibility = plot.accessibility == 1;  //ist  begehbar


            if (isforest && isaccessibility && plot.structure_lt4m.length > 0 && plot.structure_gt4m.length > 0 && plot.stand_structure === 1) { // einschichtig aber Bäume bis 4m und Bäume über 4m vorhanden

                errors.push(error( // instancePath, message, type = 1, debugInfo = Null
                    instancePath,
                    612712, // Fehlertext aus DB holen
                    'checkPlot_EBS_612712=> plot:' + plot_name + ' cluster:' + cluster_name
                    // ecke verwenden
                ));

            }


            return errors;
        }


        /**
         * @function checkPlot_EBS_614106
         * @param {json} plot
         *  
         * @param {string} instancePath
         *  @param {json} previous_plot
         * @returns {Array} errors
         * @author Thomas Stauber
         * 
         * Prüfung 613813:	Schicht fehlt (Bäume<=4m)
         * Bestockung bis 4 m Höhe - Schicht  (Feld 'Schicht' im linken Block): Wert fehlt
         * Es wurden Baumarten für Bestockung bis 4 m Höhe aufgezählt, aber es fehlt die Schichtzuordnung
         * 
         * Fehlertext: Schicht fehlt (Bäume<=4m)
         */
        static checkPlot_EBS_614106 = async (plot, instancePath, previous_plot = {}) => {
            let errors = [];
            let plot_name = plot.plot_name;
            let cluster_name = plot.cluster_name;
            var isforest = [3, 4, 5, 23, 24, 25].includes(plot.forest_status);   //ist  wald
            var isaccessibility = plot.accessibility == 1;  //ist  begehbar


            if (isforest && isaccessibility && plot.structure_lt4m.length > 0 && plot.trees_less_4meter_layer === null) { // bäume bis 4m vorhanden aber der Eintrag in scicht fehlt 

                errors.push(error( // instancePath, message, type = 1, debugInfo = Null
                    instancePath,
                    614106, // Fehlertext aus DB holen
                    'checkPlot_EBS_614106=> plot:' + plot_name + ' cluster:' + cluster_name
                    // ecke verwenden
                ));



            }


            return errors;
        }

        /**
         * @function checkPlot_EBS_613813
         * @param {json} plot
         *  
         * @param {string} instancePath
         *  @param {json} previous_plot
         * @returns {Array} errors
         * @author Thomas Stauber
         * 
         * Prüfung 613813:	Spiegelungsart 0 <-> Baumdaten	Bestockung über 4 m Höhe - Art der Spiegelung: 
         * Als Spiegelungsart wurde 0 angegeben, aber es gibt ein oder mehrere Bäume in der WZP1/2, die gespiegelt wurden	
         * Wenn Bäume gespiegelt wurden, muss die Spiegelungsart > 0 sein.
         * 
         * Fehlertext: Spiegelungsart 0 <-> Baumdaten: Wenn Bäume gespiegelt wurden, muss die Spiegelungsart > 0 sein
         * 
         * Prüfung 613814:	Spiegelungsart 0 <-> Baumdaten	Bestockung über 4 m Höhe - Art der Spiegelung: 
         * Als Spiegelungsart wurde 1,2 angegeben, aber es gibt keine Bäume in der WZP1/2, die gespiegelt wurden	
         * Wenn keine Bäume gespiegelt wurden, muss die Spiegelungsart = 0 sein.
         * 
         * Fehlertext: Spiegelungsart > 0 <-> Baumdaten: Wenn keine Bäume gespiegelt wurden, muss die Spiegelungsart = 0 sein
         * 
         * Prüfung 750910:	Spiegelungsart 0 <-> Baumdaten	
         * Für den Baum bzw. die Baumart in der WZP1\/2 wurde Spiegelung (1=ja) angegeben, aber die Spiegelungsart 
         * (im Kopf des Fromulares, Teil WZP1\/2) ist mit 0=\"ohne Spiegelung\" angegeben
         * 
         * Fehlertext: Spiegelungsart > 0 <-> Baumdaten: Wenn Bäume nicht gespiegelt wurden, muss die Spiegelungsart = 0 sein
         * 
         */


        static checkPlot_EBS_613813_613814_750910 = async (plot, instancePath, previous_plot = {}) => {
            let errors = [];
            let plot_name = plot.plot_name;
            let cluster_name = plot.cluster_name;
            var isforest = [3, 4, 5, 23, 24, 25].includes(plot.forest_status);   //ist  wald
            var isaccessibility = plot.accessibility == 1;  //ist  begehbar
            plot.structure_gt4m;


            var plot_structure_gt4m_mirrored = plot.structure_gt4m.filter(structure_gt4m => structure_gt4m.is_mirrored === true);

            if (isforest && isaccessibility && plot_structure_gt4m_mirrored.length > 0 & plot.trees_greater_4meter_mirrored === 0) { // plot ist gespiegelt und anzahl gespiegelter Bäume > 0

                errors.push(error( // instancePath, message, type = 1, debugInfo = Null
                    instancePath,
                    613813, // Fehlertext aus DB holen
                    'checkPlot_EBS_613813=> plot:' + plot_name + ' cluster:' + cluster_name
                    // ecke verwenden
                ));



            }

            if (isforest && isaccessibility && plot_structure_gt4m_mirrored.length === 0 & plot.trees_greater_4meter_mirrored > 0) { // plot ist gespiegelt und anzahl gespiegelter Bäume > 0

                errors.push(error( // instancePath, message, type = 1, debugInfo = Null
                    instancePath,
                    613814, // Fehlertext aus DB holen
                    'checkPlot_EBS_613814=> plot:' + plot_name + ' cluster:' + cluster_name
                    // ecke verwenden
                ));



            }


            if (isforest && isaccessibility && plot_structure_gt4m_mirrored.length === 0 & plot.trees_greater_4meter_mirrored > 0) { // plot ist gespiegelt und anzahl gespiegelter Bäume > 0

                errors.push(error( // instancePath, message, type = 1, debugInfo = Null
                    instancePath,
                    750910, // Fehlertext aus DB holen
                    'checkPlot_EBS_750910=> plot:' + plot_name + ' cluster:' + cluster_name
                    // ecke verwenden
                ));



            }


            return errors;
        }


        /**
        * @function checkPlot_RAN_810419
        * @param {json} plot
        * @param {string} instancePath
        * @param {json} previous_plot
        * @returns {Array} errors
        * @author Thomas Stauber
        * 
        * Prüfung 810419:Der Waldrand wurde bei der Vorgängerinventur  (RkV_Soll) NICHT als ausgeschieden deklariert. 
        * Die Waldrandkennziffer Rk darf deshalb NICHT  größer als 2000 sein (mit 2000 sind Ränder gekennzeichnet, 
        * die bei einer früheren Inventur ausgefallen sind ).
        * Fehlertext : Die Waldrandkennziffer Rk darf nicht größer als 2000 sein, wenn Vorgänger bereits ausgefallen ist
        */

        static checkPlot_RAN_810419 = async (plot, instancePath, previous_plot = {}) => {
            let errors = [];
            let plot_name = plot.plot_name;
            let cluster_name = plot.cluster_name;
            let edges = plot.edges;
            let valid_edges = edges.filter(edges => Number(edges.edge_status) > 2000);  // aktueller Rand ausgefallen Randkennziffer größer 2000


            if (valid_edges.length > 0) { //  neue ausgefallene Ränder vorhanden?
                for (let i = 0; i < valid_edges.length; i++) {

                    let oldedge = previous_plot.edges.filter(edges => edges.intkey === valid_edges[i].intkey);
                    //if (oldedge.length > 0) { // gab es den Rand schon in der Vorgängerinventur?
                    if (oldedge.filter(oldedge => Number(oldedge.edge_status) > 2000).length > 0) {   //und war er dort schon ausgefallen

                        errors.push(error( // instancePath, message, type = 1, debugInfo = Null
                            instancePath,
                            810419, // Fehlertext aus DB holen
                            'checkPlot_RAN_810419=> plot:' + plot_name + ' cluster:' + cluster_name
                            // ecke verwenden
                        ));


                    }
                }

            }

            return errors;

        }
        /**
        * @function checkPlot_RAN_819941
        * @param {json} plot
        * @param {string} instancePath
        * @param {json} previous_plot
        * @returns {Array} errors
        * @author Thomas Stauber
        * 
        * Prüfung 819941:	für CI 2027 (Waldrandkennziffer Rk=0 oder 1) dürfen nur max. 2 Wald- bzw. Bestandesränder definiert werden.
        * Fehlertext : Fehlertext: max. 2 Linien zulässig
        */
        static checkPlot_RAN_819941 = async (plot, instancePath, previous_plot = {}) => {
            let errors = [];
            let plot_name = plot.plot_name;
            let cluster_name = plot.cluster_name;
            let edges = plot.edges;
            let valid_edges = edges.filter(edges => (Number(edges.edge_status) === 0 || Number(edges.edge_status) === 1));  // gültige Ränder

            if (valid_edges.length > 2) {

                errors.push(error( // instancePath, message, type = 1, debugInfo = Null
                    instancePath,
                    819941, // Fehlertext aus DB holen
                    'checkPlot_RAN_819941=> plot:' + plot_name + ' cluster:' + cluster_name
                    // ecke verwenden
                ));


            }

            return errors;

        }

        /**
        * @function checkPlot_RAN_810413
        * @param {json} plot
        * @param {string} instancePath
        * @param {json} previous_plot
        * @returns {Array} errors
        * @author Thomas Stauber
        * 
        * Prüfung 810413:	Waldrand-/Bestandesgrenzen-Kennziffer (Spalte 'Rk'): Wert ungleich 0 und ungleich 4 unzulässig
        * Der Waldrand bzw. die Bestandeslinie ist aus keiner Vorgängerinventur bekannt. 
        * Deshalb ist die Linie NEU und die Randkennziffer Rk darf nur 0 oder 4 sein (neuer Rand bzw. neue Linie)
        * Fehlertext : Waldrand-/Bestandesgrenzen(-Kennziffer (Spalte edge_status):  ungleich 0,4 unzulässig, weil die Grenzlinie NEU ist',
        */
        static checkPlot_RAN_810413 = async (plot, instancePath, previous_plot = {}) => {
            let errors = [];
            let plot_name = plot.plot_name;
            let cluster_name = plot.cluster_name;
            let edges = plot.edges;
            let previous_edges = [];
            let new_edges = [];

            for (let previous_edge of previous_plot.edges) {
                previous_edges.push(previous_edge.intkey.split('_')[0]);
            }

            for (let new_edge of plot.edges) {
                new_edges.push(new_edge.intkey.split('_')[0]);
            }


            let old_edges = edges.filter(edges => Number(edges.edge_status) !== 0 && Number(edges.edge_status) !== 4);  // ungültige Ränder wegen Randkennziffer ungleich 0 oder ungleich 4

            for (let new_edge_intkey of new_edges) {
                var is_old_edge = previous_edges.includes(new_edge_intkey);
                if (!is_old_edge && old_edges.length > 0) {  // neue ecke mit Randkennziffer ungleich 0 oder ungleich 4

                    errors.push(error( // instancePath, message, type = 1, debugInfo = Null
                        instancePath,
                        810413, // Fehlertext aus DB holen
                        'checkPlot_RAN_810413=> plot:' + plot_name + ' cluster:' + cluster_name
                        // ecke verwenden
                    ));

                }
            }


            return errors;

        }


        /**
        * @function checkPlot_RAN_819922_819923_819924
        * @param {json} plot
        * @param {string} instancePath
        * @param {json} previous_plot
        * @returns {Array} errors
        * @author Thomas Stauber
        * 
        * Prüfung 819942:	 Anfangs- = Knickpkt	Anfangspunkt (Felder 'A_Hori, A_Azi) ist identisch mit Knickpunktpunkt
        * (Felder 'K_Hori', 'K_Azi')
        * Fehlertext :Anfangs, Ende oder Knickpkt identisch
        */
        static checkPlot_RAN_819922_819923_819924 = async (plot, instancePath, previous_plot = {}) => {
            let errors = [];
            let valid_edges = [];
            let plot_name = plot.plot_name;
            let cluster_name = plot.cluster_name;
            let edges = plot.edges;
            valid_edges = edges.filter(edges => Number(edges.edge_status) < 9);  // gültige Ränder

            for (let edge of valid_edges) {
                if (edge.edges.length > 1) {  //mindestens 2 koordinatenpaare braucht die Grenze
                    var counts = edge.edges.reduce((group, item) => {
                        var azimuth = item.azimuth;
                        var distance = item.distance;
                        if (!group.hasOwnProperty(azimuth + distance)) {
                            const anzahl = 1;
                            group[azimuth + distance] = anzahl;

                        }
                        else { group[azimuth + distance]++; } //increment count of azimuth
                        return group;
                    }
                        , {} //empty init object of group to reduce into
                    );

                    Object.keys(counts).forEach(key => {
                        if (counts[key] > 1) {

                            errors.push(error( // instancePath, message, type = 1, debugInfo = Null
                                instancePath,
                                819922, // Fehlertext aus DB holen
                                'checkPlot_RAN_819922_819923_819924=> plot:' + plot_name + ' cluster:' + cluster_name
                                // ecke verwenden
                            ));


                        }
                    });


                }
            }

            return errors;

        }
        /**
        * @function checkPlot_RAN_2027_1
        * @param {json} plot
        * @param {string} instancePath
        * @param {json} previous_plot
        * @returns {Array} errors
        * @author Thomas Stauber
        * 
        * Prüfung 819942:	Grenzkreis eines Baumes überschreitet Bestandesgrenze
        * Anfangs- und Endpunkt der Grenze z.B. Waldrandlinie liegen außerhalb des Grenzkreis eines Baumes
        * Warnungstext: Grenzkreis außerhalb Bestandesgrenze
        */
        static checkPlot_RAN_2027_1 = async (plot, instancePath, previous_plot = {}) => {
            let errors = [];
            let plot_name = plot.plot_name;
            let cluster_name = plot.cluster_name;
            let trees = plot.tree;
            let edges = plot.edges;
            let valid_edges = edges.filter(edges => Number(edges.edge_status) < 9);  // gültige Ränder



            for (let tree of trees) {
                if (tree.tree_status < 2) {  // gültiger Probebaum
                    for (let edge of valid_edges) {
                        let corners = [];
                        for (let i = 0; i < edge.edges.length; i++) {
                            var thetaGRD = edge.edges[i].azimuth / 400 * 360;  // Winkel in Grad
                            var xy_coordinates = Calc.polarkoordinatenZuKartesisch(edge.edges[i].distance, thetaGRD); //Koordinaten der Grenze
                            corners.push(xy_coordinates);
                            if (corners.length > 1) {  //mindestens 2 koordinatenpaare braucht die Grenze
                                var grenztoleranz = Calc.grenztoleranz(tree.dbh_height, tree.dbh);
                                var thetaGRDTree = tree.azimuth / 400 * 360;  // Winkel in Grad
                                var xy_coordinatesTree = Calc.polarkoordinatenZuKartesisch(tree.distance, thetaGRDTree); //Koordinaten des Baumes
                                //schneidet der Baumgrenzkreis die Bestandesgrenze?
                                var IntersecBorderCircle = Calc.lineCircle(corners[i - 1].x, corners[i - 1].y, corners[i].x, corners[i].y, xy_coordinatesTree.x, xy_coordinatesTree.y, grenztoleranz);
                                //console.log("Grenzkreis Baum: " + tree.tree_number + " Plot:" +plot_name + " außerhalb Grenze:", IntersecBorderCircle);
                                var firtscornerpoint = corners[0];
                                var lastcornerpoint = corners[corners.length - 1];
                                var test_firtscornerpoint = Calc.pointOutsideCircle(firtscornerpoint.x, firtscornerpoint.y, xy_coordinatesTree.x, xy_coordinatesTree.y, grenztoleranz);
                                var test_lastcornerpoint = Calc.pointOutsideCircle(lastcornerpoint.x, lastcornerpoint.y, xy_coordinatesTree.x, xy_coordinatesTree.y, grenztoleranz);
                                // Baumgrenzkreis schneidet die Bestandesgrenze
                                if (IntersecBorderCircle && (test_firtscornerpoint && test_lastcornerpoint)) {  // Baumgrenzkreis schneidet die Bestandesgrenze , start und Endpunkt liegen außerhalb des Kreises

                                    errors.push(error( // instancePath, message, type = 1, debugInfo = Null
                                        instancePath,
                                        819942, // Fehlertext aus DB holen
                                        'checkPlot_RAN_2027_1=> plot:' + plot_name + ' cluster:' + cluster_name + ' Baum:' + tree.tree_number + ' Grenzkreis außerhalb Bestandesgrenze'
                                        // ecke verwenden
                                    ));

                                }

                            }
                        }


                    }
                }
            }

            return errors;
        }
        /**
        * @function checkPlot_RAN_2027_2
        * @param {json} plot
        * @param {string} instancePath
        * @param {json} previous_plot
        * @returns {Array} errors
        * @author Thomas Stauber
        * 
        * Prüfung 819943: Baum außerhalb Bestandesgrenze
        * Bäume können auch jenseits der Bestandesgrenze liegen, wenn sie nicht zu dem Bestand gehören, in dem der Stichprobenpunkt liegt. 
        * Bäume des Bestandes sollten aber alle auf der gleichen Seite stehen.
        * 
        * Fehlertext: Baum außerhalb Bestandesgrenze
        */
        static checkPlot_RAN_2027_2 = async (plot, instancePath, previous_plot = {}) => {
            let errors = [];
            let plot_name = plot.plot_name;
            let cluster_name = plot.cluster_name;
            let trees = plot.tree;
            let edges = plot.edges;
            let valid_edges = edges.filter(edges => Number(edges.edge_status) < 9);  // gültige Ränder
            for (let tree of trees) {
                if (tree.tree_status < 2) {  // gültiger Probebaum
                    for (let edge of valid_edges) {
                        let corners = [];
                        for (let i = 0; i < edge.edges.length; i++) {
                            var thetaGRD = edge.edges[i].azimuth / 400 * 360;  // Winkel in Grad
                            var xy_coordinates = Calc.polarkoordinatenZuKartesisch(edge.edges[i].distance, thetaGRD); //Koordinaten der Grenze
                            corners.push(xy_coordinates);
                            if (corners.length > 1) {  //mindestens 2 koordinatenpaare braucht die Grenze


                                var thetaGRDTree = tree.azimuth / 400 * 360;  // Winkel in Grad
                                var xy_coordinatesTree = Calc.polarkoordinatenZuKartesisch(tree.distance, thetaGRDTree); //Koordinaten des Baumes

                                var firtscornerpoint = corners[0];
                                var lastcornerpoint = corners[corners.length - 1];

                                // die Gerade Plotmittelpunkt - Baummittelpunkt schneidet die Bestandesgrenze?
                                var test_hinterGrenze = Calc.lineToLine(0, 0, xy_coordinatesTree.x, xy_coordinatesTree.y, firtscornerpoint.x, firtscornerpoint.y, lastcornerpoint.x, lastcornerpoint.y);


                                if (test_hinterGrenze) {  // die Gerade Plotmittelpunkt - Baummittelpunkt schneidet die Bestandesgrenze Baum liegt hinter der Bestandesgrenze

                                    errors.push(error( // instancePath, message, type = 1, debugInfo = Null
                                        instancePath,
                                        819943, // Fehlertext aus DB holen
                                        'checkPlot_RAN_2027_2=> plot:' + plot_name + ' cluster:' + cluster_name + ' Baum:' + tree.tree_number + ' außerhalb Bestandesgrenze'
                                        // ecke verwenden
                                    ));
                                }
                            }
                        }
                    }
                }
            }
            return errors;
        }



        // /** 
        // * @function checkPlot_RAN_819911
        // * @param {json} plot
        // * @param {string} instancePath
        // * @param {json} previous_plot
        // * @returns {Array} errors
        // * @author Thomas Stauber
        // * 
        // * Prüfung 819911:	Es wurden Waldränder oder Bestandesgrenzen erfasst (Formular 'RAN'), 
        // * obwohl sie lt. Waldentscheid oder Begehbarkeit nicht hätten aufgenommen werden können	
        // * Prüfen Sie ob der Waldentscheid (ungleich 3 oder  5) oder Begehbarkeit (ungleich 1) korrekt sind. 
        // * Oder überprüfen Sie die Randkennziffer (Spalte 'Rk') - sie darf nicht 0 und nicht 4 sein.
        // * Warnungstext: Wald-/Bestandesgrenzen aufgenommen, trotz Waldentscheid oder Begehbarkeit
        // */

        // static checkPlot_RAN_819911 = async (plot, instancePath, previous_plot = {}) => {
        //     let errors = [];
        //     let plot_name = plot.plot_name;
        //     let cluster_name = plot.cluster_name;
        //     var isforest = [3, 4, 5, 23, 24, 25].includes(plot.forest_status);   //ist  wald
        //     var isaccessibility = plot.accessibility == 1;  //ist  begehbar

        //     let valid_edges = plot.edges.filter(edges => Number(edges.edge_status) < 9);  // gültige Ränder
        //     let unvalid_edges = plot.edges.filter(edges => Number(edges.edge_type) === 0 || Number(edges.edge_type) === 4);  // ungültige Ränder wegen Randkennziffer 0 oder 4

        //     if (((!isforest || !isaccessibility) && (valid_edges.length > 0)) || (unvalid_edges.length > 0)) { // Waldentscheid oder Begehbarkeit nicht korrekt oder ungültige Ränder

        //         const errorText = Calc.errorText(819911); // Fehlertext aus DB holen

        //         errors.push(error( // instancePath, message, type = 1, debugInfo = Null
        //             instancePath,
        //             errorText.get("error") + ":" + errorText.get("message"),
        //             errorText.get("key"), // Fehlertext aus DB holen
        //             'checkPlot_RAN_819911=> plot:' + plot_name + ' cluster:' + cluster_name
        //             // ecke verwenden
        //         ));

        //     }


        //     return errors;

        // }

        /**
        * @function checkPlot_RAN_819912
        * @param {json} plot
        * @param {string} instancePath
        * @param {json} previous_plot
        * @returns {Array} errors
        * @author Thomas Stauber
        * 
        * Prüfung 819912:	Es wurden keine Waldränder oder Bestandesgrenzen erfasst (Formular 'RAN')
        * Prüfen Sie, ob die Aufnahme von Waldrändern oder Bestandesgrenzen (Formular 'RAN') vergessen wurde! 
        * Sie können rechts neben dem Datenbanknavigator 0='keine Objekte vorhanden' eintragen, um diese Meldung zukünftig 
        * zu unterdrücken.
        * Fehlertext: keine Waldränder/Bestandesgrenzen
        */

        static checkPlot_RAN_819912 = async (plot, instancePath, previous_plot = {}) => {
            let errors = [];
            let plot_name = plot.plot_name;
            let cluster_name = plot.cluster_name;

            var isforest = [3, 4, 5, 23, 24, 25].includes(plot.forest_status);   //ist  wald
            [3, 4, 5].includes(previous_plot.forest_status);   //war  wald
            ![8, 9].includes(previous_plot.forest_status) || plot.forest_status === null;   //ist  im Inventurgebiet
            [3, 5].includes(previous_plot.forest_status);   // war holzboden
            var iswoodground = [3, 5, 23, 25].includes(plot.forest_status);   // ist holzboden
            var isaccessibility = plot.accessibility == 1;  //ist  begehbar

            let valid_edges = plot.edges.filter(edges => Number(edges.edge_status) < 9);  // gültige Ränder

            if ((isforest && isaccessibility && iswoodground) && (valid_edges.length === 0)) {

                //const errorText = Calc.errorText(819912); // Fehlertext aus DB holen

                errors.push(error(
                    instancePath,
                    819912,
                    'checkPlot_RAN_819912=> plot:' + plot_name + ' cluster:' + cluster_name
                ));

            }


            return errors;

        }

        /**
            * @function checkPlot_EAL_613106
            * @param {json} plot
            * @param {string} instancePath
            * @param {json} previous_plot
            * @returns {Array} errors
            * @author Thomas Stauber
            * 
            * Prüfung 613106 Nutzungsart (usage_type) fehlt
            * Fehlertext: Nutzungsart fehlt
            */
        static checkPlot_EAL_613106 = async (plot, instancePath, previous_plot = {}) => {
            let errors = [];
            let plot_name = plot.plot_name;
            let cluster_name = plot.cluster_name;
            var isforest = [3, 4, 5, 23, 24, 25].includes(plot.forest_status);   //ist  wald
            var isaccessibility = plot.accessibility == 1;  //ist  begehbar    


            if (isaccessibility && isforest && plot.usage_type === null) {  //ist begehbar und wald und nutzungsart fehlt

                errors.push(error( // instancePath, message, type = 1, debugInfo = Null
                    instancePath,
                    613106, // Fehlertext aus DB holen
                    'checkPlot_EAL_613106=> plot:' + plot_name + ' cluster:' + cluster_name
                    // ecke verwenden
                ));


            }
            return errors;

        }

        /**
            * @function checkPlot_EAL_612110
            * @param {json} plot
            * @param {string} instancePath
            * @param {json} previous_plot
            * @returns {Array} errors
            * @author Thomas Stauber
            * 
            * Prüfung 612110 Geländeneigung(plot.terrain_slope) Wert unzulässig >3 [Grad] bei Geländeform=0 (Ebene) 	
            * erwartet: <=3 Grad. Geländeform =0 (Ebene)
            * Fehlertext: Geländeneigung(plot.terrain_slope) Wert unzulässig >3 [Grad] bei Geländeform=0 (Ebene)
            */
        static checkPlot_EAL_612110 = async (plot, instancePath, previous_plot = {}) => {
            let errors = [];
            let plot_name = plot.plot_name;
            let cluster_name = plot.cluster_name;

            if (plot.terrain_slope !== null && plot.terrain_slope > 3 && plot.terrain_exposure === 0) {  //Geländeneigung > 3 Grad und Geländeexposition = 0 (Ebene)

                errors.push(error( // instancePath, message, type = 1, debugInfo = Null
                    instancePath,
                    612110, // Fehlertext aus DB holen
                    'checkPlot_EAL_613106=> plot:' + plot_name + ' cluster:' + cluster_name
                    // ecke verwenden
                ));

            }
            return errors;

        }

        /**
            * @function checkPlot_EAL_612291
            * @param {json} plot
            * @param {string} instancePath
            * @param {json} previous_plot
            * @returns {Array} errors
            * @author Thomas Stauber
            * 
            * Prüfung 612291 Gexp (plot.terrain_exposure)	hier überflüssig - nur erforderlich, wenn Geländeneigung(plot.terrain_slope) > 3 Grad 
            * (Überprüfen Sie vorsichtshalber die Geländeneigung)
            * Fehlertext: Geländeexposition unnötig Geländeexposition [gon]: Wert nicht erforderlich, erst ab Geländeneigung < 3 Grad
            */
        static checkPlot_EAL_612291 = async (plot, instancePath, previous_plot = {}) => {
            let errors = [];
            let plot_name = plot.plot_name;
            let cluster_name = plot.cluster_name;

            if (plot.terrain_slope !== null && plot.terrain_slope < 3 && plot.terrain_exposure !== null) {  //Geländeneigung < 3 Grad und Geländeexposition nicht null

                errors.push(error( // instancePath, message, type = 1, debugInfo = Null
                    instancePath,
                    612291,
                    'checkPlot_EAL_612291=> plot:' + plot_name + ' cluster:' + cluster_name
                    // ecke verwenden
                ));


            }
            return errors;

        }

        /**
        * @function checkPlot_EAL_612306
        * @param {json} plot
        * @param {string} instancePath
        * @param {json} previous_plot
        * @returns {Array} errors
        * @author Thomas Stauber
        * 
        * Prüfung 612306 istWald und begehbar, Betriebsart fehlt
        * Fehlertext: Betriebsart fehlt
        */
        static checkPlot_EAL_612306 = async (plot, instancePath, previous_plot = {}) => {
            let errors = [];
            let plot_name = plot.plot_name;
            let cluster_name = plot.cluster_name;
            var isforest = [3, 4, 5, 23, 24, 25].includes(plot.forest_status);   //ist  wald

            if (plot.accessibility === 1 && isforest && plot.management_type === null) {  //ist begehbar und management_type felt

                errors.push(error( // instancePath, message, type = 1, debugInfo = Null
                    instancePath,
                    612306,
                    'checkPlot_EAL_612306=> plot:' + plot_name + ' cluster:' + cluster_name
                    // ecke verwenden
                ));

            }
            return errors;

        }


        /**
        * @function checkPlot_EAL_619994
        * @param {json} plot
        * @param {string} instancePath
        * @param {json} previous_plot
        * @returns {Array} errors
        * @author Thomas Stauber
        * 
        * Prüfung 619994 Obwohl eine Blöße ausgeschieden wurde, wurden WZP-Bäume bzw. Verjüngung aufgenommen	
        * Kontrollieren Sie, ob  Waldentscheid=3 (Blöße) richtig ist. 
        * Warnungstext: Merkmale überflüssig
        */
        static checkPlot_EAL_619994 = async (plot, instancePath, previous_plot = {}) => {
            let errors = [];
            let plot_name = plot.plot_name;
            let cluster_name = plot.cluster_name;


            if (plot.forest_status === 3) {  //ist blösse
                let validTrees = plot.tree.filter(tree => Number(tree.tree_status) < 2);  // neue oder wiederholt erfasste baüme
                let regeneration = plot.structure_lt4m.filter(structure_lt4m => Number(structure_lt4m.regeneration_type) !== null);  // verjüngung
                if (validTrees.length > 0 || regeneration.length > 0) {

                    errors.push(error( // instancePath, message, type = 1, debugInfo = Null
                        instancePath,
                        619994,
                        'checkPlot_EAL_619994=> plot:' + plot_name + ' cluster:' + cluster_name
                        // ecke verwenden
                    ));

                }
            }


            return errors;

        }



        /**
        * @function checkPlot_EAL_432715
        * @param {json} plot
        * @param {string} instancePath
        * @param {json} previous_plot
        * @returns {Array} errors
        * @author Thomas Stauber
        * 
        * Prüfung 432715 Es wurde mind. 1 Ursache für innerbetriebliche Nutzungseinschränkungen angegeben, aber keine 
        * Nutzungseinschränkung vermerkt (Spalte 'Nutz.Einschr.<=0')	
        * Wenn mind. eine der Spalten  'Streulage', 'unzur. Erschließung', 'Gelände', 'geringer Ertrag',
        *   's. innerbetriebl. Urs.') 1 ist , muss Spalte 'Nutz.Einschr.' größer 0 sein
        */
        static checkPlot_EAL_432715 = async (plot, instancePath, previous_plot = {}) => {
            let errors = [];
            let plot_name = plot.plot_name;
            let cluster_name = plot.cluster_name;



            if ((plot.harvest_restriction <= 0) && (plot.harvest_restriction !== null)) {
                if (plot.harvest_restriction_nature_reserve ||
                    plot.harvest_restriction_protection_forest ||
                    plot.harvest_restriction_recreational_forest ||
                    plot.harvest_restriction_scattered ||
                    plot.harvest_restriction_fragmented ||
                    plot.harvest_restriction_insufficient_access ||
                    plot.harvest_restriction_low_yield ||
                    plot.harvest_restriction_wetness ||
                    plot.harvest_restriction_private_conservation ||
                    plot.harvest_restriction_other_internalcause
                ) {

                    errors.push(error( // instancePath, message, type = 1, debugInfo = Null
                        instancePath,
                        432715,
                        'checkPlot_EAL_432715=> plot:' + plot_name + ' cluster:' + cluster_name
                        // ecke verwenden
                    ));
                }
            }


            return errors;

        }

        /**
        * @function checkPlot_EAL_619993
        * @param {json} plot
        * @param {string} instancePath
        * @param {json} previous_plot
        * @returns {Array} errors
        * @author Thomas Stauber
        * 
        * Prüfung 619993 Es wurden Merkmale angesprochen, die für Nichtwald bzw. Ecken außerhalb Inventurgebiet nicht relevant sind.
        * Dies gilt auch für Nichtbegehbarkeit.	Kontrollieren Sie, ob Wald/Nichtwald=0 (Nichtwald) oder 8/9 (nicht relevant) 
        * richtig ist oder Begehbarkeit. (Überflüssige Merkmale: Geländeform, Biotop, Betriebsart, nat.Waldgesellschaft(Feld),
        *  bes. Gefährdung, Aufbau, Altersbestimmung, Alter, EZ7)
        * Fehlertext: Merkmale (terrain_form, biotope, forest_community_field, stand_structure, stand_age) überflüssig
        */
        static checkPlot_EAL_619993 = async (plot, instancePath, previous_plot = {}) => {
            let errors = [];
            let plot_name = plot.plot_name;
            let cluster_name = plot.cluster_name;

            var isforest = [3, 4, 5, 23, 24, 25].includes(plot.forest_status);   //ist  wald
            [3, 4, 5].includes(previous_plot.forest_status);   //war  wald
            var isinarea = ![8, 9].includes(previous_plot.forest_status) || plot.forest_status === null;   //ist  im Inventurgebiet
            [3, 5].includes(previous_plot.forest_status);   // war holzboden
            [3, 5, 23, 25].includes(plot.forest_status);   // ist holzboden
            var isaccessibility = plot.accessibility == 1;  //ist  begehbar



            if ((!isforest || !isinarea || !isaccessibility) && (plot.forest_status !== null && previous_plot.forest_status !== null)) {
                if (plot.terrain_form === null ||
                    plot.biotope === null ||
                    plot.management_type === null ||
                    plot.forest_community_field === null ||
                    plot.stand_structure === null ||
                    plot.stand_age === null) {


                    errors.push(error( // instancePath, message, type = 1, debugInfo = Null
                        instancePath,
                        619993,
                        'checkPlot_EAL_619993=> plot:' + plot_name + ' cluster:' + cluster_name
                        // ecke verwenden
                    ));
                }
            }


            return errors;

        }


        /**
         * @function checkPlot_VE_432711
         * @param {json} plot
         * @param {string} instancePath
         * @param {json} previous_plot
         * @returns {Array} errors
         * @author Thomas Stauber
         * 
         *Prüfung 432711 Waldentscheid <-> Nutzungseinschränkung ?	Widerspruch zwischen Waldentscheid (ungleich Holzboden 3 oder 5) 
         * und Nutzungseinschränkung > 0	Wenn die Ecke kein Holzboden ist (oder sie sogar Nichtwald ist 
         * oder außerhalb des Inventurgebietes liegt) kann keine Nutzungseinschränkung vorliegen. 
         * Kontrollieren Sie bitte den Waldentscheid und die Nutzungseinschränkung! (harvest_restriction)
         */
        static checkPlot_VE_432711 = async (plot, instancePath, previous_plot = {}) => {
            let errors = [];
            let plot_name = plot.plot_name;
            let cluster_id = plot.cluster_id;

            var isforest = [3, 4, 5, 23, 24, 25].includes(plot.forest_status);   //ist  wald
            [3, 4, 5].includes(previous_plot.forest_status);   //war  wald
            var isinarea = ![8, 9].includes(previous_plot.forest_status) || plot.forest_status === null;   //ist  im Inventurgebiet
            [3, 5].includes(previous_plot.forest_status);   // war holzboden
            var iswoodground = [3, 5, 23, 25].includes(plot.forest_status);   // ist holzboden

            // Waldentscheid <-> Nutzungseinschränkung

            if ((!iswoodground || !isforest || !isinarea) && plot.harvest_restriction > 0) {

                errors.push(error( // instancePath, message, type = 1, debugInfo = Null
                    instancePath,
                    432711, // Fehlertext aus DB holen
                    'checkPlot_VE_432711=> plot:' + plot_name + ' cluster:' + cluster_id
                    // ecke verwenden
                ));
            }


            return errors;

        }

        /**
            * @function checkPlot_VE_433106_433111bis433117
            * @param {json} plot
            * @param {string} instancePath
            * @param {json} previous_plot
            * @returns {Array} errors
            * @author Thomas Stauber
            * 
            * Prüfung 433106
            * Wert fehlt	Die Landnutzungsart (land_use_before) muss angegeben werden
            * , sowie Wald zu Nichtwald oder Nichtwald zu Wald wurde. Voraussetzung: Schnittmenge Inventurgebiet Maske VE 
            * InvE2012=1 UND Wa nicht 8 und nicht 9 (Spalten b3_ecke.DOP=InvE2012=1 UND b3f_ecke_vorkl.Wa NOT IN (8,9))
            * ********************************************************************
            * Fehlertext: Die Landnutzungsart (land_use_before) muss angegeben werden
            * die Prüfungen für die Waldentscheidung sind in der Funktion checkPlot_VE_433106_433111bis433117 ebenfalls enthalten
            */
        static checkPlot_VE_433106_433111bis433117 = async (plot, instancePath, previous_plot = {}) => {
            let errors = [];
            let plot_name = plot.plot_name;
            let cluster_id = plot.cluster_id;

            var isforest = [3, 4, 5, 23, 24, 25].includes(plot.forest_status);   //ist  wald
            var wasforest = [3, 4, 5].includes(previous_plot.forest_status);   //war  wald
            var isinarea = ![8, 9].includes(previous_plot.forest_status) || plot.forest_status === null;   //ist  im Inventurgebiet
            var waswoodground = [3, 5].includes(previous_plot.forest_status);   // war holzboden
            var iswoodground = [3, 5, 23, 25].includes(plot.forest_status);   // ist holzboden
            //waldentscheid Wechsel bei Vorgängerinventur testen

            // sterr = "433106" '433106=Landnutzungsart Wert fehlt
            // If ((warWald = 1 And istWald = 0) OrElse (warWald = 0 And istWald = 1)) AndAlso lanu = -1 Then
            //     WriteFehler(param, sterr, cErrDat, Me.vbFunc.Tnr.ToString, Me.vbFunc.Enr.ToString)
            // End If

            // im Inventurgebiet
            if (isinarea) {


                if ((wasforest && !isforest) || (!wasforest && isforest)) {
                    if (plot.land_use_before === null) {
                        errors.push(error( // instancePath, message, type = 1, debugInfo = Null
                            instancePath,
                            'Die Landnutzungsart (land_use_before) muss angegeben werden',
                            'checkPlot_VE_433106=> plot:' + plot_name + ' cluster:' + cluster_id
                            // ecke verwenden
                        ));
                    }
                }
                // die Prüfungen 433111-433117 für die Waldentscheidung  folgen hier:  
                /**
                 * @function checkPlot_VE_433111
                 * Landnutzungsart: Wert 90="Traktecke war schon früher eindeutig Nichtwald" unzulässig. Der rückwirkende Datenkorrekturwunsch 
                 * des Waldentscheides 2012 zu Nichtwald ist unberechtigt oder falsch.	Erlaubt, wenn Waldentscheid der Vorgänger-Inventur 
                 * fälschlicher Weise 3,4,5 war und Waldentscheid aktuell 0 (Nichtwald) ist, also wenn keine Landnutzungsänderung vorhanden ist.
                 *  Voraussetzung: Schnittmenge Inventurgebiet beider Inventuren
                 */
                // 433111=Landnutzungsart Wert 90 unzulässig, keine Ahnung ob landuse_after oder land_use_before gemeint ist

                if ((wasforest && !isforest) || (!wasforest && !isforest) && plot.land_use_after === 90) {
                    if (plot.land_use_before === null) {

                        errors.push(error( // instancePath, message, type = 1, debugInfo = Null
                            instancePath,
                            433111, // Fehlertext aus DB holen
                            'checkPlot_VE_433111=> plot:' + plot_name + ' cluster:' + cluster_id
                            // ecke verwenden
                        ));
                    }
                }
                /**
                 * @function checkPlot_VE_433112
                 * Landnutzungsart: Wert 99="Traktecke war schon früher eindeutig Wald" unzulässig. .
                 * Der rückwirkende Datenkorrekturwunsch des Waldentscheides 2012 zu Wald  ist unberechtigt oder falsch.	
                 * Erlaubt, wenn Waldentscheid der Vorgänger-Inventur falschlicher Weise 0= "Nichtwald" war UND Waldentscheid aktuell 3,4 
                 * oder 5 (Wald) ist, also wenn keine Landnutzungsänderung vorhanden ist. Voraussetzung: Schnittmenge Inventurgebiet beider Inventuren
                 */
                // 433112=Landnutzungsart Wert 99 unzulässig
                if ((wasforest && !isforest) || (wasforest && isforest) && plot.land_use_after === 99) {

                    errors.push(error( // instancePath, message, type = 1, debugInfo = Null
                        instancePath,
                        433112, // Fehlertext aus DB holen
                        'checkPlot_VE_433112=> plot:' + plot_name + ' cluster:' + cluster_id
                        // ecke verwenden
                    ));

                }
                /**
                 * @function checkPlot_VE_433113
                 * LaNu unzulässig	Landnutzungsart: Wert unzulässig, da die Ecke zu beiden Inventurzeitpunkten Wald war. 
                 * Ausnahme ggf. Lanu=92 oder 93	Der Wert muss nur angegeben werden, wenn ein Landnutzungswechsel stattfand. 
                 * Bei Nichtwaldecken ist diese Angabe evtl. nützlich für die Zukunft. Landnutzung kann auch angegeben werden, wenn der Waldentscheid von 2012 rückwirkend geändert werden soll (90-99). Voraussetzung: Schnittmenge Inventurgebiet
                 *************
                 * Fehlertext: LaNu unzulässig
                 */

                if ((wasforest && isforest) && (plot.land_use_after !== null && ![92, 93].includes(plot.land_use_after))) {

                    errors.push(error( // instancePath, message, type = 1, debugInfo = Null
                        instancePath,
                        433113, // Fehlertext aus DB holen
                        'checkPlot_VE_433113=> plot:' + plot_name + ' cluster:' + cluster_id
                        // ecke verwenden
                    ));


                }
                /**
                 * @function checkPlot_VE_433114
                 * Landnutzungsart: Wert 92="Traktecke war schon früher eindeutig Nichtholzboden" unzulässig.
                 * Der rückwirkende Datenkorrekturwunsch des Waldentscheides 2012 zu Nichtholzboden ist unberechtigt oder falsch.	
                 * Erlaubt, wenn Waldentscheid der Vorgänger-Inventur fälschlicher Weise KEIN Nichtholzboden (<>4)  
                 * war und Waldentscheid aktuell 4 (Nichtholzboden) ist, also wenn keine Landnutzungsänderung vorhanden ist. 
                 * Voraussetzung: Schnittmenge Inventurgebiet beider Inventuren
                 * Fehlertext: LaNu=92 unzulässig
                 */
                // 433114=Landnutzungsart Wert 92 unzulässig
                if ((previous_plot.forest_status === 4 || plot.forest_status !== 4) && plot.land_use_after === 92) {

                    errors.push(error( // instancePath, message, type = 1, debugInfo = Null
                        instancePath,
                        433114, // Fehlertext aus DB holen
                        'checkPlot_VE_433114=> plot:' + plot_name + ' cluster:' + cluster_id
                        // ecke verwenden
                    ));


                }
                /**
                 * @function checkPlot_VE_433115
                 * Landnutzungsart: Wert 93="Traktecke war schon früher eindeutig Holzboden" unzulässig. 
                 * Der rückwirkende Datenkorrekturwunsch des Waldentscheides 2012 zu Holzboden ist unberechtigt oder falsch.	
                 * Erlaubt, wenn Waldentscheid der Vorgänger-Inventur fälschlicher Weise 0 oder 4 war und Waldentscheid 
                 * aktuell 3 oder 5 (Holzboden) ist, also wenn keine Landnutzungsänderung vorhanden ist. 
                 * Voraussetzung: Schnittmenge Inventurgebiet beider Inventuren
                 */
                // 433115=Landnutzungsart Wert 93 unzulässig
                if ((waswoodground || !iswoodground || (waswoodground && iswoodground)) && plot.land_use_after === 93) {

                    errors.push(error( // instancePath, message, type = 1, debugInfo = Null
                        instancePath,
                        433115, // Fehlertext aus DB holen
                        'checkPlot_VE_433115=> plot:' + plot_name + ' cluster:' + cluster_id
                        // ecke verwenden
                    ));

                }
                /**
                 * @function checkPlot_VE_433116
                 * Landnutzungsart: Wert >=90 mit rückwirkendem Datenkorrekturwunsch des Waldentscheids 2012 ist unberechtigt oder falsch.	
                 * Die Traktecke gehört NICHT bei beiden Inventuren zum Inventurgebiet. 
                 * Siehe Maske VE Zellen InvE2012 (b3_ecke.DOP) und Wa (b3f_ecke_vorkl.Wa). 
                 * Es muss also keine Landnutzungsart angesprochen werden.
                 */

                // 433116=Landnutzungsart Werte größer gleich 90 sind unzulässig
                if (plot.land_use_after !== null && plot.land_use_after >= 90) {

                    errors.push(error( // instancePath, message, type = 1, debugInfo = Null
                        instancePath,
                        433116, // Fehlertext aus DB holen
                        'checkPlot_VE_433116=> plot:' + plot_name + ' cluster:' + cluster_id
                        // ecke verwenden
                    ));

                }
                /**
                 * @function checkPlot_VE_433117
                 * LaNu unzulässig	Landnutzungsart: Wert unzulässig. Es wurde ein Wert angegeben, obwohl die Ecke kein Nichtwald ist. 
                 * Bei Nichtwaldecken darf die Landnutzungsart vermerkt werden.	Die Traktecke gehört NICHT bei beiden Inventuren zum 
                 * Inventurgebiet. Siehe Maske VE Zellen  InvE2012 (b3_ecke.DOP) und Wa (b3f_ecke_vorkl.Wa). 
                 * Es muss also keine Landnutzungsart angesprochen werden.
                 */
                // 433117=Landnutzungsart darf nur bei Nichtwaldecken "als Vormerker" angegeben werden
                if (plot.forest_status > 0 && plot.land_use_after !== null && plot.land_use_after > 1 && plot.land_use_after < 90) {

                    errors.push(error( // instancePath, message, type = 1, debugInfo = Null
                        instancePath,
                        433117, // Fehlertext aus DB holen
                        'checkPlot_VE_433117=> plot:' + plot_name + ' cluster:' + cluster_id
                        // ecke verwenden
                    ));

                }

                //Zugehörigkeit zu beiden Inventuren testen, nicht möglich, das DOP in den Daten nicht vorhanden ist
            }

            return errors;

        }

        /**
        * @function checkTree_WZP4_820549
        * @param {json} plot
        * @param {string} instancePath
        * @param {json} previous_plot
        * @returns {Array} errors
        * @author Thomas Stauber
        * 
        * Prüfung 820549
        * Bk=12  <==> Nutzungsart<19	Der Baum wurde genutzt (tree_status=12), aber die Nutzungsart land_use_after auf der Ecke (Formular EAL) 
        * ist kleiner gleich 19 (keine Nutzung, ...)	Wenn Bäume genutzt wurden, muss die Nutzungsart (Formular EAL) > 19 
        * (... Nutzung, ...) sein. Bitte korrigieren Sie die Probebaumkennziffer tree_status oder die land_use_after!
        * ********************************************************************
        * Fehlertext: genutzter Baum wurde auf Ecke ohne Nutzung erfasst
        */
        static checkTree_WZP4_820549 = async (plot, instancePath, previous_plot = {}) => {
            let errors = [];
            let plot_name = plot.plot_name;
            let cluster_id = plot.cluster_id;

            // Filter all trees with tree_status = 12 (used tree)
            let unvalidTrees = plot.tree.filter(tree => Number(tree.tree_status) === 12);


            for (const tree of unvalidTrees) {

                if (plot.land_use_after !== null && plot.land_use_after <= 19) {

                    errors.push(error( // instancePath, message, type = 1, debugInfo = Null
                        instancePath,
                        820549, // Fehlertext aus DB holen
                        'checkTree_WZP4_820549=> plot:' + plot_name + ' cluster:' + cluster_id + ' tree:' + tree.tree_number
                        // ecke verwenden
                    ));
                }
            }

            return errors;

        }

        /**
        * @function checkTree_WZP4_820536
        * @param {json} plot
        * @param {string} instancePath
        * @param {json} previous_plot
        * @returns {Array} errors
        * @author Thomas Stauber
        * Prüfung 820536
        * Die Probebaumkennziffer tree_status (alt'Bk') darf nicht 11 sein	Die Probebaumkennziffer 11  ist für als ausgeschieden
        * markierte Bäume oder ausgeschiedene ungültige Probebäume (z.B. außerhalb des Bestandes) zu verwenden.
        * Achtung! Sonderbehandlung für BB
        * ********************************************************************
        * Fehler-Text: Der Baum darf nicht als tree_status = 11 ( ausgeschiedener Baum außerhalb der Stichprobe) bezeichnet werden.
        */
        static checkTree_WZP4_820536 = async (plot, instancePath, previous_plot = {}) => {
            let errors = [];
            let plot_name = plot.plot_name;
            let cluster_id = plot.cluster_id;

            var isforest = [3, 4, 5].includes(plot.forest_status);   //ist  wald
            var isaccessibility = plot.accessibility == 1;  //ist  begehbar
            //sonderbehandlung für BB
            if (isforest && isaccessibility && plot.federal_state === 'BB') {

                let unvalidTrees = plot.tree.filter(tree => Number(tree.tree_status) < 2 && Number(tree.dbh) !== null && Number(tree.distance) !== null);
                // Baum gehört nicht zu WZP4 (lt. Grenzstammkontrolle), muss Pk = 10 bekommen ( nur BB)
                for (const tree of unvalidTrees) {
                    if (tree.distance > Calc.grenztoleranz(tree.dbh_height, tree.dbh)) {

                        errors.push(error( // instancePath, message, type = 1, debugInfo = Null
                            instancePath,
                            820536, // Fehlertext aus DB holen
                            'checkTree_WZP4_820536=> plot:' + plot_name + ' cluster:' + cluster_id + ' tree:' + tree.tree_number
                            // ecke verwenden
                        ));
                    }
                }

            }
            //für alle anderen Länder
            else {

                let unvalidTrees = plot.tree.filter(tree => Number(tree.tree_status) === 11);
                for (const tree of unvalidTrees) {
                    if (previous_plot.tree) {
                        let previous_tree = previous_plot.tree.find(t => t.tree_number === tree.tree_number);
                        if (previous_tree && tree.tree_number === previous_tree.tree_number && Number(previous_tree.tree_status) !== 8 && Number(previous_tree.tree_height) !== 1111 && Number(previous_tree.tree_height) > 1) {

                            errors.push(error( // instancePath, message, type = 1, debugInfo = Null
                                instancePath,
                                820536, // Fehlertext aus DB holen
                                'checkTree_WZP4_820536=> plot:' + plot_name + ' cluster:' + cluster_id + ' tree:' + tree.tree_number
                                // ecke verwenden
                            ));

                        }
                    }
                }

            }


            return errors;
        }


        /**
        * @function checkTree_WZP4_829992
        * @param {json} plot
        * @param {string} instancePath
        * @param {json} previous_plot
        * @returns {Array} errors
        * @author Thomas Stauber
        * Prüfung: 829992 
        * kein Baum im Hb (WZP4) Es wurde kein Baum der WZP dem Hauptbestand zugeordnet
        * Warnungstext: kein Baum im Hb (WZP4)
        */
        static checkTree_WZP4_829992 = async (plot, instancePath, previous_plot = {}) => {
            let errors = [];
            let plot_name = plot.plot_name;
            let cluster_id = plot.cluster_id;

            var isforest = [3, 4, 5].includes(plot.forest_status);   //ist  wald
            var isaccessibility = plot.accessibility == 1;  //ist  begehbar

            if (isforest && isaccessibility) {
                // Filter all trees with stand_layer = 1 and tree_status < 2 (valid tree)
                let standLayerEquals2 = plot.tree.filter(tree => Number(tree.stand_layer) === 1 && Number(tree.tree_status) < 2);


                if (standLayerEquals2.length === 0) {
                    errors.push(error( // instancePath, message, type = 1, debugInfo = Null
                        instancePath,
                        829992, // Fehlertext aus DB holen
                        'checkTree_WZP4_829992=> plot:' + plot_name + ' cluster:' + cluster_id
                        // ecke verwenden
                    ));

                }
            }



            return errors;
        }


        /**
         * @function checkTree_WZP4_829912
         * @param {json} plot
         * @param {string} instancePath
         * @param {json} previous_plot
         * @returns {Array} errors
         * @author Thomas Stauber
         * Prüfung 829912: Es wurden WZP/ZF4-Bäume erfasst (Formular 'WZP'), obwohl sie lt. Waldentscheid oder Begehbarkeit nicht hätten aufgenommen werden können	
         * Prüfen Sie ob der Waldentscheid (ungleich 3, 4 oder 5) oder Begehbarkeit (ungleich 1) korrekt sind.
         * Oder überprüfen Sie die Probebaumkennziffer (Spalte 'Bk') in der WZP/ZF4 - sie sollten weder 0 noch 1 sein, wenn Bäume nicht mehr zur CI 2017-Stichprobe gehören.
         * *********************************************************************************************
         * Fehlertext: Es wurden WZP/ZF4-Bäume erfasst trotz Waldentscheid = kein Wald oder fehlender Begehbarkeit und  die Bäume nicht mehr zur Stichprobe gehören.	
         */
        static checkTree_WZP4_829912 = async (plot, instancePath, previous_plot = {}) => {
            let plot_name = plot.plot_name;
            let cluster_id = plot.cluster_id;

            let errors = [];


            var isnotforest = ![3, 4, 5].includes(plot.forest_status);   //ist nicht wald
            var isnotaccessibility = plot.accessibility === 0;  //ist nicht begehbar


            if (isnotforest || isnotaccessibility) {
                let unvalidTrees = plot.tree.filter(tree => Number(tree.tree_status) < 2);
                for (const tree of unvalidTrees) {

                    errors.push(error( // instancePath, message, type = 1, debugInfo = Null
                        instancePath,
                        829912, // Fehlertext aus DB holen
                        'checkTree_WZP4_829912=> plot:' + plot_name + ' cluster:' + cluster_id + ' tree:' + tree.tree_number
                        // ecke verwenden
                    ));


                }

            }

            return errors;
        }



        /**
        * @function checkTree_WZP4_820540
        * @param {json} plot
        * @param {string} instancePath
        * @param {json} previous_plot
        * @returns {Array} errors
        * @author Thomas Stauber
        *      
        * Prüfung 820540:  Der Baum hat die Probebaumkennziffer(tree_status) 6 (außerhalb des Bestandes), es ist jedoch keine Bestandesgrenze vorhanden (RAN).	
        * Bitte prüfen Sie, ob in Maske RAN Bestandesgrenzen vorhanden ist oder ob die Probebaumkennziffer korrigiert werden muss
        * ***************************************
        * Fehlermeldung: Der Baum hat die Probebaumkennziffer(tree_status) 6 (außerhalb des Bestandes), es ist jedoch keine Bestandesgrenze(edges) vorhanden
        */
        static checkTree_WZP4_820540 = async (plot, instancePath, previous_plot = {}) => {

            let errors = [];
            let plot_name = plot.plot_name;
            let cluster_id = plot.cluster_id;
            let edges = plot.edges;

            //ist Wald markierte Bäume 
            let unvalidTrees = plot.tree.filter(tree => tree.tree_status === "6" && edges.length === 0);

            for (const tree of unvalidTrees) {

                errors.push(error( // instancePath, message, type = 1, debugInfo = Null
                    instancePath,
                    820540, // Fehlertext aus DB holen
                    'checkTree_WZP4_820540=> plot:' + plot_name + ' cluster:' + cluster_id + ' tree:' + tree.tree_number
                    //trakt und ecke verwenden
                ));

            }

            return errors;
        }


        /**
        * @function checkTree_WZP4_820538
        * @param {json} plot
        * @param {string} instancePath
        * @param {json} previous_plot
        * @returns {Array} errors
        * @author Thomas Stauber
        * 
        * Prüfung 820538:  Die Probebaumkennziffer Bk muss größer als 1 sein, wenn der Waldentscheid(forest_status) ungleich 5 ist	
        * Die Probebaumkennziffer Bk (tree_status) muss größer als 1 sein, da es sich nun um eine Blöße oder Nichtholzboden handelt 
        * ***************************************
        * Fehlermeldung: Die Probebaumkennziffer Bk muss größer als 1 sein, wenn der Waldentscheid ungleich 5 ist
        */
        static checkTree_WZP4_820538 = async (plot, instancePath, previous_plot = {}) => {

            let errors = [];
            let plot_name = plot.plot_name;
            let cluster_id = plot.cluster_id;
            let forest_status = plot.forest_status;

            //ist Wald markierte Bäume 
            let unvalidTrees = plot.tree.filter(tree => tree.tree_status < 2 && forest_status !== 5);

            for (const tree of unvalidTrees) {

                errors.push(error( // instancePath, message, type = 1, debugInfo = Null
                    instancePath,
                    820538, // Fehlertext aus DB holen
                    'checkTree_WZP4_820538=> plot:' + plot_name + ' cluster:' + cluster_id + ' tree:' + tree.tree_number
                    //trakt und ecke verwenden
                ));

            }

            return errors;
        }

        /**
        * @function checkTree_WZP4_820533
        * @param {json} plot
        * @param {string} instancePath
        * @param {json} previous_plot
        * @returns {Array} errors
        * @author Thomas Stauber
        *      
        * Prüfung 820533:  Die Probebaumkennziffer Bk ist 1111='permanent markierter Hilfsbaum zum Wiederfinden der Traktecke; 
        * kein Probebaum', aber das Merkmal Perm ist ungleich 1. Bitte setzen Sie auch Perm auf 1 oder ändern Sie die Probebaumkennziffer Bk ungleich 1111 
        * *************************************** 
        * Fehlermeldung: Die Probebaumkennziffer Bk ist 1111='permanent markierter Hilfsbaum zum Wiederfinden der Traktecke, aber das Merkmal Perm ist ungleich 1. 
        * Bitte setzen Sie auch Perm auf 1, wenn der Baum permanent markiert ist oder ändern Sie die Probebaumkennziffer Bk ungleich 1111
        */

        static checkTree_WZP4_820533 = async (plot, instancePath, previous_plot = {}) => {

            let errors = [];
            let plot_name = plot.plot_name;
            let cluster_id = plot.cluster_id;

            //permanent markierte Bäume 
            let validTrees = plot.tree.filter(tree => tree.tree_status === "1111" && tree.tree_marked === false);

            for (const tree of validTrees) {

                errors.push(error( // instancePath, message, type = 1, debugInfo = Null
                    instancePath,
                    820533, // Fehlertext aus DB holen
                    'checkTree_WZP4_820533=> plot:' + plot_name + ' cluster:' + cluster_id + ' tree:' + tree.tree_number
                    //trakt und ecke verwenden
                ));

            }

            return errors;
        }






        /**
         * @function checkTree_WZP4_820511_820512
         * @param {json} plot
         * @param {string} instancePath
         * @param {json} previous_plot
         * @returns {Array} errors
         * @author Thomas Stauber
         * 
         * Prüfung 820511: Probebaumkennziffer (Spalte 'Bk'): ist 0 oder 8 = neuer Baum, aber Baum ist von Vorgängerinventur bekannt	
         * Schon von Vorgängerinventur bekannte Bäume dürfen dieProbebaumkennziffern 0 oder 8 nicht erhalten, außer  bei Hilfsbäumen Pk=1111
         * ***************************************
         * Fehlermeldung: Baumstatus 0 oder 8 (neuer Baum) ist unzulässig, weil der Baum schon in der Vorgänger Inventur gemessen wurde
         * 
         * Prüfung 820512: Probebaumkennziffer (Spalte 'Bk'): Wert ungleich 0 und ungleich 8, 1111 unzulässig	Der Baum ist  kein 
         * Stichproben-Baum der Vorgängerinventur.  Deshalb ist der Baum NEU und die Probebaumkennziffern Bk darf nur 0 oder in Ausnahmefällen 8 oder 1111 sein.
         * ***************************************
         * Fehlermeldung: Baumstatus muss 0 oder 8 (neuer Baum) sein, weil der Baum schon in der Vorgänger Inventur nicht gemessen wurde
         */
        static checkTree_WZP4_820511_820512 = async (plot, instancePath, previous_plot = {}) => {
            // noch in diskussion,  deshalb noch ohne Funktion, fehlercodes und Beschreibung bereits in der DB
            let errors = [];
            plot.plot_name;
            plot.cluster_id;

            return errors;
        }

        /**
         * @function checkTree_WZP4_821306
         * @param {json} plot
         * @param {string} instancePath
         * @param {json} previous_plot
         * @returns {Array} errors
         * @author Thomas Stauber
         * 
         * Prüfung 821306: Baumhöhe: Wert fehlt, Im Plenterwald (Formular EAL, Betriebsart='2') muss von jedem Baum die Baumhöhe gemessen werden.
         * Das gleiche gilt für Bäume mit Bestandesschicht = '0' (Spalte 'Bs'). 
         * 
         * Fehlermeldung:  Hat der Plot die Betriebsart 2 = Plenterwald oder die Bestandesschicht = 0, ist für jeden Baum die Höhe zu messen
        */
        static checkTree_WZP4_821306 = async (plot, instancePath, previous_plot = {}) => {

            let errors = [];
            let plot_name = plot.plot_name;
            let cluster_id = plot.cluster_id;
            let management_type = plot.management_type;

            //valide Bäume
            let validTrees = plot.tree.filter(tree => tree.tree_status < 2);

            for (const tree of validTrees) {
                if ((tree.stand_layer !== null) && (management_type !== null)) {
                    if ((management_type === '2' || tree.stand_layer === '0') && tree.tree_height === null) {

                        errors.push(error( // instancePath, message, type = 1, debugInfo = Null
                            instancePath,
                            821306, // Fehlertext aus DB holen
                            'checkTree_WZP4_821306=> plot:' + plot_name + ' cluster:' + cluster_id + ' tree:' + tree.tree_number
                            //trakt und ecke verwenden
                        ));
                    }
                }
            }


            return errors;
        }

        // ----------------------- Cluster Functions -----------------------
        /**
         * @function checkTree_WZP4_820916
         * @param {json} plot
         * @param {string} instancePath
         * @param {json} previous_plot
         * @returns {Array} errors
         * @author Thomas Stauber
         * 
         *  Prüfung: 820916 BHD-Messung, obwohl Baum physisch nicht mehr vorhanden, also kein BHD messbar ist (bei Pk In 4,9,11,12) 
         *  Fehlermeldung:****************************************************************************
         * 
         *  Brusthöhendurchmesser (Spalte BHD): Wert unmöglich, wenn der Baum als ausgefallen bzw. ausgeschieden gekennzeichnet wurde (Bk={4, 9,11,12}) 
         */
        static checkTree_WZP4_820916 = async (plot, instancePath, previous_plot = {}) => {

            let errors = [];
            let plot_name = plot.plot_name;
            let cluster_id = plot.cluster_id;


            //unvalide Bäume
            let unvalidTrees = plot.tree.filter(tree => [4, 9, 11, 12].includes(tree.tree_status));

            for (const tree of unvalidTrees) {

                if (tree.dbh !== null) {

                    errors.push(error( // instancePath, message, type = 1, debugInfo = Null
                        instancePath,
                        820916, // Fehlertext aus DB holen
                        'checkTree_WZP4_820916=> plot:' + plot_name + ' cluster:' + cluster_id + ' tree:' + tree.tree_number
                        //trakt und ecke verwenden
                    ));
                }

            }


            return errors;
        }

        /**
         * @function checkTree_WZP4_822611_822612
         * @param {json} plot
         * @param {string} instancePath
         * @param {json} previous_plot
         * @returns {Array} errors
         * @author Thomas Stauber 
         * 
         * Prüfung: 822611 Bei Bs=0 (plenterartig) für Baum muss  die Betriebsart <> 2 (Plenterwald) sein
         * Fehlertext:********************************************************
         * Fehler: Hat der Plot die Betriebsart <> 2 (kein Plenterwald),ist für einen Baum die Bestandesschicht =0 (plenterartig) unzulässig
         * 
         * Prüfung: 822612 Bei Bs <> 0 für Baum  muss die Betriebsart ungleich 2 (Plenterwald) 
         * Fehlertext:********************************************************
         * Fehler: Hat der Plot die Betriebsart 2 = Plenterwald, ist für einen Baum die Bestandesschicht <> 0   unzulässig  
         */
        static checkTree_WZP4_822611_822612 = async (plot, instancePath, previous_plot = {}) => {

            let errors = [];
            let plot_name = plot.plot_name;
            let cluster_id = plot.cluster_id;
            let management_type = plot.management_type;

            //valide Bäume
            let validTrees = plot.tree.filter(tree => tree.tree_status < 2);

            for (const tree of validTrees) {
                if ((tree.stand_layer !== null) && (management_type !== null)) {
                    if (management_type === '2' && tree.stand_layer !== '0') {

                        errors.push(error( // instancePath, message, type = 1, debugInfo = Null
                            instancePath,
                            822611, // Fehlertext aus DB holen
                            'checkTree_WZP4_822611_822612=> plot:' + plot_name + ' cluster:' + cluster_id + ' tree:' + tree.tree_number
                            //trakt und ecke verwenden
                        ));
                    }

                    if (management_type !== '2' && tree.stand_layer === '0') {

                        errors.push(error( // instancePath, message, type = 1, debugInfo = Null
                            instancePath,
                            822612, // Fehlertext aus DB holen
                            'checkTree_WZP4_822611_822612=> plot:' + plot_name + ' cluster:' + cluster_id + ' tree:' + tree.tree_number
                            //trakt und ecke verwenden
                        ));
                    }

                }
            }


            return errors;
        }

        /**
        *
        * @function checkTree_WZP4_822613
        * @param {json} plot
        * @param {string} instancePath
        * @returns {Array} errors
        * @author Thomas Stauber
        * 
        * Prüfung 822613: Baumhöhe zu hoch in Bestandesschicht; Baum aus einer 
        * unteren Schicht ist höher als ein Baum aus einer oberen Schicht 
        * Fehlermeldungen:*******************************************************************************
        * 'Fehler: die Maximumhöhe des Hauptbestandes=1 ist höher als Minimumhöhe des Oberstandes=3'
        * 'Fehler: die Maximumhöhe des Unterstandes=2  ist höher als die Minimumhöhe des Hauptbestandes=1',
        * 'Fehler: die Maximumhöhe des Unterstandes=2  ist höher als die Minimumhöhe des Oberstandes=3',
        */
        static checkTree_WZP4_822613 = async (plot, instancePath, previous_plot = {}) => {

            let errors = [];
            let plot_name = plot.plot_name;
            let cluster_id = plot.cluster_id;


            // Filter all trees with stand_layer = varStandLayer and tree_status < 2 (valid tree)

            //valide Bäume
            let validTrees = plot.tree.filter(tree => tree.tree_status < 2);

            /* nach Schichten  stand_layer gruppiert maximale/minimale  Höhen ermitteln */

            var counts = validTrees.reduce((group, item) => {
                var stand_layer = item.stand_layer;
                if (!group.hasOwnProperty(stand_layer)) {

                    const myMap = new Map();
                    myMap['max'] = 0;
                    myMap['min'] = 0;
                    myMap['TreeStandHeights'] = [];

                    group[stand_layer] = myMap;

                }
                //push measured heights
                if (item.tree_height !== null) group[stand_layer].TreeStandHeights.push(item.tree_height);
                //group[height_group].TreegroupNumber++;
                return group;
            }
                , {} //empty init object of group to reduce into
            );

            // console.log(counts);

            Object.keys(counts).forEach(key => {
                counts[key]['max'] = Math.max(...counts[key]['TreeStandHeights']);
                counts[key]['min'] = Math.min(...counts[key]['TreeStandHeights']);

            });

            // console.log('1' in counts);
            // console.log('2' in counts);
            // console.log('3' in counts);
            //  prüfen ob  Maximumhöhe des Hauptbestandes=1 höher als Minimum des Oberstandes=3 dann Fehler
            if (('1' in counts) && ('3' in counts)) {
                if (counts['1']['max'] > counts['3']['min']) {

                    errors.push(error( // instancePath, message, type = 1, debugInfo = Null
                        instancePath,
                        822613, // Fehlertext aus DB holen
                        'checkTree_WZP4_822613=> plot:' + plot_name + ' cluster:' + cluster_id
                        //trakt und ecke verwenden
                    ));

                }
            }


            // prüfen ob  Maximumhöhe des Unterstandes=2 höher als Minimum des Hauptbestandes=1 dann fehler
            if (('1' in counts) && ('2' in counts)) {
                if (counts['2']['max'] > counts['1']['min']) {

                    errors.push(error( // instancePath, message, type = 1, debugInfo = Null
                        instancePath,
                        822613, //'Fehler: die Maximumhöhe des Unterstandes=2  ist höher als die Minimumhöhe des Hauptbestandes=1',
                        'checkTree_WZP4_822613=>plot:' + plot_name + ' cluster:' + cluster_id
                        //trakt und ecke verwenden
                    ));
                }

            }

            // prüfen ob  Maximumhöhe des Unterstandes=2 höher als Minimum des Oberstandes=3 dann fehler
            if (('2' in counts) && ('3' in counts)) {

                if (counts['2']['max'] > counts['3']['min']) {

                    errors.push(error( // instancePath, message, type = 1, debugInfo = Null
                        instancePath,
                        822613,
                        'checkTree_WZP4_822613=>plot:' + plot_name + ' cluster:' + cluster_id
                        //trakt und ecke verwenden
                    ));
                }
            }
            return errors;
        }


        /**
        * @function checkTree_WZP4_821322
        * @param {json} plot
        * @param {string} instancePath
        * @returns {Array} errors
        * @author Thomas Stauber
        * 
        * 821322	WZP4	Baumhöhe  fehlt	: Mindestens eine Baumhöhenmessung in einer Baumartengruppe innererhalb Bestand
        * (Spalte 'BaGr_H' = ...) aller Bestandesschichten (stand_layer) {1=Hauptstand,2=Unterstand,3=Oberstand} fehlt.
        * In jeder Schicht muss jede Baumartengruppe 
        * mindestens 1 Baumhöhe gemessen werden (möglichst an für die Höhenmodellierung geeigneten Bäumen 
        * vgl. Spalte 'H-Eignung' = +) .
        * Fehlertexte:******************************************************************************
        * 'Die Anzahl der Baumhöhen für Bäume mit Bestandesschicht = X die nach Baumarten gruppiert sind, muss größer als 0 sein. '
        * 
        */
        static checkTree_WZP4_821322 = async (plot, instancePath, previous_plot = {},api = null) => {

            let errors = [];
            let plot_name = plot.plot_name;
            let cluster_id = plot.cluster_id;

            // for all stand_Layer
            for (let varStandLayer = 1; varStandLayer < 4; varStandLayer++) {

                // Filter all trees with stand_layer = varStandLayer and tree_status < 2 (valid tree)
                let standLayerEquals2 = plot.tree.filter(tree => tree.stand_layer === varStandLayer.toString() && tree.tree_status < 2);

                let groupedStandLayerEquals3withheight_group = [];

                for (const tree of standLayerEquals2) {

                    // get speciesObject from lookup table
                    const speciesObject = await api.lookupByAbbreviation('tree_species', tree.tree_species);

                    if (!speciesObject || !speciesObject.height_group) {

                        return [
                            error(
                                instancePath,
                                `Tree type ${tree.tree_species} not found in lookup Table`,
                                1)
                        ];
                    }
                    //select height_group 
                    tree.height_group = speciesObject.height_group;
                    groupedStandLayerEquals3withheight_group.push(tree);
                }

                if (groupedStandLayerEquals3withheight_group.length > 0) {
                    //grouping standLayerEquals3 by any speciesObject.height_group  and count measured heights !== null) greater then 1
                    // snippet from https://stackoverflow.com/questions/44387647/group-and-count-values-in-an-array
                    var counts = groupedStandLayerEquals3withheight_group.reduce((group, item) => {
                        var height_group = item.height_group;
                        if (!group.hasOwnProperty(height_group)) {
                            group[height_group] = 0;
                        }
                        //count measured heights
                        if (item.tree_height !== null) group[height_group]++;
                        return group;
                    }
                        , {} //empty init object of group to reduce into
                    );

                    // console.log(counts);
                    // check if the sum of tree_height is 0
                    Object.keys(counts).forEach(key => {
                        if (counts[key] === 0) {

                            errors.push(error( // instancePath, message, type = 1, debugInfo = Null
                                instancePath,
                                821322, // Fehlertext aus DB holen
                                'checkTree_WZP4_821322=> plot:' + plot_name + ' cluster:' + cluster_id + ' tree:' + varStandLayer
                                // ecke verwenden
                            ));
                        }
                    });
                }
            }

            return errors;
        }


        /**
         * @function checkTree_WZP4_821320
         * @param {json} plot
         * @param {string} instancePath
         * @param {json} previous_plot
         * @returns {Array} errors
         * @author Thomas Stauber
         * 
         * Prüfung: 821320 Mindestens eine Baumhöhe der häufigsten Baumartengruppe (Spalte 'BaGr_H' = ...) des Hauptbestandes fehlt (Spalte 'Bs' = 1) fehlt.
         * Fehlermeldung:************
         * Wenn die Baumanzahl in der häufigsten Baumartengruppe im Hauptbestand > 1 ist, dann müssen 
         * mindestens 2 Baumhöhenmessungen in dieser größten Baumartengruppe vorliegen.
         */
        static checkTree_WZP4_821320 = async (plot, instancePath, previous_plot = {}) => {
            let errors = [];
            let plot_name = plot.plot_name;
            let cluster_id = plot.cluster_id;


            // Filter all trees with stand_layer = 1 and tree_status < 2 (valid tree)
            let standLayerEquals2 = plot.tree.filter(tree => tree.stand_layer === '1' && tree.tree_status < 2);
            var maxCount = 0;
            var maxKey = '';
            let groupedStandLayerEquals2withheight_group = [];


            for (const tree of standLayerEquals2) {

                // get speciesObject from lookup table
                const speciesObject = await API.lookupByAbbreviation('tree_species', tree.tree_species);

                if (!speciesObject || !speciesObject.height_group) {

                    return [
                        error(
                            instancePath,
                            `Tree type ${tree.tree_species} not found in lookup Table`,
                            1
                        )
                    ];
                }
                //select height_group 
                tree.height_group = speciesObject.height_group;
                groupedStandLayerEquals2withheight_group.push(tree);
            }


            if (groupedStandLayerEquals2withheight_group.length > 0) {
                // für die Bestandesschicht(Bs)=1 die Baumartenhöhengruppen (height_group) bilden und die max Anzahl der Höhenmessung
                // in der Gruppe ermitteln
                // snippet from https://stackoverflow.com/questions/44387647/group-and-count-values-in-an-array
                var counts = groupedStandLayerEquals2withheight_group.reduce((group, item) => {
                    var height_group = item.height_group;
                    if (!group.hasOwnProperty(height_group)) {

                        const myMap = new Map();
                        myMap['TreegroupNumber'] = 0;
                        myMap['TreeGroupNumberHeights'] = 0;

                        group[height_group] = myMap;


                    }
                    //count measured heights
                    if (item.tree_height !== null) group[height_group].TreeGroupNumberHeights++;
                    group[height_group].TreegroupNumber++;
                    return group;
                }
                    , {} //empty init object of group to reduce into
                );

                //console.log(counts);

                Object.keys(counts).forEach(key => {
                    if (counts[key]['TreegroupNumber'] > maxCount) {
                        maxCount = counts[key]['TreegroupNumber'];
                        maxKey = key;
                    }
                });

                // if the maximum number of trees per height class is > 1, then at least 2 tree height measurements must be available
                // in this largest tree species group

                if (counts[maxKey]['TreeGroupNumberHeights'] < 2 && counts[maxKey]['TreegroupNumber'] > 1) {

                    errors.push(error( // instancePath, message, type = 1, debugInfo = Null
                        instancePath,
                        821320, // Fehlertext aus DB holen
                        'checkTree_WZP4_821320=> plot:' + plot_name + ' cluster:' + cluster_id + ' tree:' + maxKey
                        // ecke verwenden
                    ));
                }

            }



            return errors;
        }

        /**
         * @function checkTree_WZP4_821321
         * @param {json} plot
         * @param {string} instancePath
         * @param {json} previous_plot
         * @returns {Array} errors
         * @author Gerrit Balindt
         *   
         * 821321: WZP4 Baumhöhe im Ust fehlt: Mindestens eine Baumhöhenmessung in einer Baumartengruppe (Spalte 'L/N' = ...) 
         * des Unterstandes (Spalte 'Bs' = 2) fehlt. Im Unterstand muss je Laub- und Nadelbäumen mindestens 1 Baumhöhe gemessen werden 
         * (möglichst an für die Höhenmodellierung geeigneten Bäumen vgl. Spalte 'H-Eignung' = +).
         * Fehlertexte:*********************************************************************
         * Die Anzahl der Baumhöhen für Bäume in Bestandesschicht = 2, die nach Taxonomieordnung gruppiert sind, muss größer als 0 sein.
         * 
        */

        static checkTree_WZP4_821321 = async (plot, instancePath, previous_plot = {}) => {
            let errors = [];
            let plot_name = plot.plot_name;
            let cluster_id = plot.cluster_id;

            // Filter all trees with stand_layer = 2 and tree_status < 2 (valid tree)
            let standLayerEquals2 = plot.tree.filter(tree => tree.stand_layer === '2' && tree.tree_status < 2);

            // if there are no trees with stand_layer = 2 and tree_status < 2
            if (standLayerEquals2.length === 0) return errors;
            let groupedStandLayerEquals2withtaxonomy_order = [];
            for (const tree of standLayerEquals2) {

                // get speciesObject from lookup table
                const speciesObject = await API.lookupByAbbreviation('tree_species', tree.tree_species);

                if (!speciesObject || !speciesObject.taxonomy_order) {

                    return [
                        error(
                            instancePath,
                            `Tree type ${tree.tree_species} not found in lookup Table`,
                            1
                        )
                    ];
                }

                tree.taxonomy_order = speciesObject.taxonomy_order;
                groupedStandLayerEquals2withtaxonomy_order.push(tree);

                // const key = tree.tree_species + '_' + tree.stand_layer + '_' + speciesObject.taxonomy_order;
                // groupedStandLayerEquals2[key] = (groupedStandLayerEquals2[key] || initialValue) + tree.tree_height;
            }
            if (groupedStandLayerEquals2withtaxonomy_order.length > 0) {
                //grouping standLayerEquals2 by speciesObject.taxonomy_order {'L','N'} and count measured heights !== null)
                // snippet from https://stackoverflow.com/questions/44387647/group-and-count-values-in-an-array
                var counts = groupedStandLayerEquals2withtaxonomy_order.reduce((group, item) => {
                    var taxonomy_order = item.taxonomy_order;
                    if (!group.hasOwnProperty(taxonomy_order)) {
                        group[taxonomy_order] = 0;
                    }
                    //count measured heights
                    if (item.tree_height !== null) group[taxonomy_order]++;
                    return group;
                }
                    , {} //empty init object of group to reduce into
                );

                //console.log(counts);
                // check if the sum of tree_height is 0
                Object.keys(counts).forEach(key => {
                    if (counts[key] === 0) {

                        errors.push(error( // instancePath, message, type = 1, debugInfo = Null
                            instancePath,
                            821321, // Fehlertext aus DB holen
                            'checkTree_WZP4_821321=> plot:' + plot_name + ' cluster:' + cluster_id + ' tree:' + key
                            // ecke verwenden
                        ));
                    }
                });
            }
            return errors;
        }

        /**
         * @function checkTree_WZP4_820547
         * @param {json} plot
         * @param {string} instancePath
         * @param {json} previous_plot
         * @returns {Array} errors
         * @author Gerrit Balindt
         *   
         * Prüfung 820547: Kein stehender toter Baum aufgenommen!
         * In TOT wurde stehendes Totholz aufgenommen jedoch kein stehender toter Baum in WZP4 mit Hori <= 500 cm!
         * Hinweis: Bitte prüfen Sie die WZP4 und TOT
         * 
         * Fehlertext:Kein stehender toter Baum aufgenommen!
         * 
        */
        static checkTree_WZP4_820547 = async (plot, instancePath, previous_plot = {}) => {

            let errors = [];
            let plot_name = plot.plot_name;
            let cluster_id = plot.cluster_id;
            // standing deadwood Totholz  plot.deadwood
            let standingDeadTrees = plot.deadwood.filter(tree => [2, 3].includes(tree.dead_wood_type));

            // Filter all trees with tree_status 5 and distance <= 500
            let DeadTrees = plot.tree.filter(tree => Number(tree.tree_status) === 5 && Number(tree.distance) <= 500);


            if (standingDeadTrees.length > 0 && DeadTrees.length === 0) {

                errors.push(error( // instancePath, message, type = 1, debugInfo = Null
                    instancePath,
                    820547, // Fehlertext aus DB holen
                    'checkTree_WZP4_820547=> plot:' + plot_name + ' cluster:' + cluster_id
                    // ecke verwenden
                ));
            }

            return errors;
        }

        /**
         * @function checkTree_WZP4_820546
         * @param {json} plot
         * @param {string} instancePath
         * @param {json} previous_plot
         * @returns {Array} errors
         * @author Gerrit Balindt
         *   
         * Prüfung 820546: Kein stehendes Totholz aufgenommen
         * In WZP4 wurde ein stehender toter Baum aufgenommen jedoch kein stehendes Totholz in der Maske TOT!
         * Hinweis: Bitte prüfen Sie die WZP4 und TOT
         * 
         * Fehlertext:Bitte prüfen Sie die Totholzart und Horizontalentfernung
         * 
        */
        static checkTree_WZP4_820546 = async (plot, instancePath, previous_plot = {}) => {

            let errors = [];
            let plot_name = plot.plot_name;
            let cluster_id = plot.cluster_id;
            // standing deadwood Totholz  plot.deadwood
            let standingDeadTrees = plot.deadwood.filter(tree => [2, 3].includes(tree.dead_wood_type));

            // Filter all trees with tree_status 5 and distance <= 500
            let DeadTrees = plot.tree.filter(tree => Number(tree.tree_status) === 5 && Number(tree.distance) <= 500);


            if (standingDeadTrees.length === 0 && DeadTrees.length > 0) {

                errors.push(error( // instancePath, message, type = 1, debugInfo = Null
                    instancePath,
                    820546, // Fehlertext aus DB holen
                    'checkTree_WZP4_820546=> plot:' + plot_name + ' cluster:' + cluster_id
                    // ecke verwenden
                ));
            }

            return errors;
        }


        // ----------------------- System Functions -----------------------
    }

    //import Validation from "../validation.js";

    /**
     * @class Cluster
     * @description Class for checking plausibility of PLOTS (No cross-plot data test possible)
     * @author Gerrit Balindt <gerrit.balindt@thuenen.de>
     */
    class Cluster {

        // ----------------------- Cluster Functions -----------------------

        // ----------------------- Cluster Functions -----------------------

        /**
            * @function checkPlot_POSI_611512
            * @param {json} plot
            *  
            * @param {string} instancePath
            * @param {json} previous_plot
            * @returns {Array} errors
            * @author Thomas Stauber
            * 
            * Prüfung 611512: Markierung unzulässig
            * Eck-Markierung gesetzt\/gefunden: Wert unzulässig, da es eine Wiederholungsaufnahme ist, siehe POSI-Vorgänger, 
            * insbesondere Perm2012 - relevant für Auswertungsperiode 2012-2022 (bei 4 dürfen Daten von 2012 und 2022 nicht miteinander verglichen werden) 
            * Die Traktecke wurde schon früher aufgenommen bzw. permanent markiert (vgl. POSI Ansicht Vorgänger) --> Markierung darf nicht '3' sein\". Bitte Markierung auf 1, 2 oder 4 setzen!
            * 
            * Fehlertext: Markierung unzulässig
            */
        static checkPlot_POSI_611512 = async (cluster, instancePath, previous_cluster = {}) => {
            let errors = [];

            let cluster_name = cluster.cluster_name;
            cluster.cluster_id;
            
            if (cluster.plot.length > 1 && previous_cluster.plot.length > 1) {
                for (let plot of cluster.plot) {
                    // i++;
                    let samePlotAsPrev = previous_cluster.plot.filter(prev_plot => Number(prev_plot.plot_name) === Number(plot.plot_name)); // art join des aktuellen Plots vs. previous Plots
                    if (samePlotAsPrev.length > 0 && plot.marker_status === 3) { // Markierung unzulässig
                        let plot_name = plot.plot_name;

                        errors.push(error( // instancePath, message, type = 1, debugInfo = Null
                            instancePath,
                            611512, // Fehlertext aus DB holen
                            'checkPlot_POSI_611512=> plot:' + plot_name + ' cluster:' + cluster_name
                            // ecke verwenden
                        ));
                   }
                }


            }

            return errors;
        }

        /**
         * 
             * @function checkPlot_VE_434917_434916
             * @param {json} cluster
             * @param {string} instancePath
             * @param {json} previous_cluster
             * @returns {Array} errors
             * @author Thomas Stauber
             *  * Prüfung 434917: Bl <-> Traktkennung 
             * Traktkennung  ungleich "4", "1", "5", "7", "8", "10"  <-> alle Traktecken in einem Land	Traktkennung 
             * oder Waldentscheid ist falsch: Wenn alle Traktecken in einem Land liegen, kann es ein Normal-Trakt("4") / Trakt außerhalb 
             * des Inventurgebietes("1") oder Verdichtungsgebietes("5") / teilweise("7") oder komplette("8") 
             * Verdichtung oder zu dicht an anderem Trakt ("10") sein.
             * 
             * * Prüfung 434916: Bl <-> TrKenn=4	TrKenn=4 (Traktkennzeichen="N"="Normaltrakt") widerspricht Länderangaben 
             * an den Traktecken	Traktkennung oder Landeszuordnung an den Traktecken ist falsch: 
             * Wenn ein Trakt verschiedene Länder berührt, handelt es sich um Trakte mit der Kennung: 2, 3 oder 6. 
             * Bei Normal-Trakten (TrKenn=4) muss für jede Traktecke das selbe Bundesland angegeben werden.
             */
        static checkPlot_VE_434917_434916 = async (cluster, instancePath, previous_cluster = {}) => {
            let errors = [];
            cluster.cluster_name;
            cluster.cluster_id;
            //cluster hat mehr als ein Plot
            if (cluster.plot.length > 1) {
                var counts = cluster.plot.reduce((group, item) => {
                    var federal_state = item.federal_state;
                    if (!group.hasOwnProperty(federal_state)) {
                        group[federal_state] = 0;
                    }
                    //count measured heights
                    if (item.tree_height !== null) group[federal_state]++;
                    return group;
                }
                    , {} //empty init object of group to reduce into
                );

                if (Object.keys(counts).length === 1) {
                    Object.keys(counts).forEach(key => {
                        if (counts[key] === 4) {
                            // für alle Traktecken in einem Land und kein Normal-Trakt("4") 
                            if (![4, 1, 5, 7, 8, 10].includes(cluster.cluster_status)) {
                                errors.push(error( // instancePath, message, type = 1, debugInfo = Null
                                    instancePath,
                                    'Traktkennung  ungleich 4 , 1, 5, 7, 8, 10  widersprüchlich zu: alle 4 Traktecken liegen in einem Land',
                                    1));

                            }

                        } else {

                            errors.push(error( // instancePath, message, type = 1, debugInfo = Null
                                instancePath,
                                'Traktkennung=4 (Traktkennzeichen="N"="Normaltrakt") widerspricht Länderangaben an den Traktecken',
                                1));
                        }
                    });
                }

            }



            return errors;

        }

        // ----------------------- System Functions -----------------------

        static className = "Cluster";

    }

    class Trees {

        // ----------------------- Tree Functions -----------------------

        /**
        * @function checkTree_WZP4_820546
        * @param {json} tree
        * @param {string} instancePath
        * @param {json} previous_tree
        * @returns {Array} errors
        * @author Thomas Stauber
        * 
        * Prüfung 820546
        * Kein stehendes Totholz aufgenommen	 
        * In WZP4 wurde ein stehender toter Baum aufgenommen jedoch kein stehendes Totholz in der Maske TOT!	
        * Bitte prüfen Sie die Totholzart und Horizontalentfernung
        * ********************************************************************
        * Fehlertext: Kein stehendes Totholz aufgenommen
        */
        static checkTree_WZP4_820546 = async (tree, instancePath, previous_tree = {}) => {

            //totholztyp ist entweder 2 oder 3
            /* var xor_2_3 = ((Number(deadwood.dead_wood_type) === 3) && !(Number(deadwood.dead_wood_type) === 2)) || (!(Number(deadwood.dead_wood_type) === 3) && (Number(deadwood.dead_wood_type) === 2));
            let errors = [];
            if (tree.tree_number === previous_tree.tree_number && Number(previous_tree.tree_status) < 2 && xor_2_3) {
                if (tree.tree_status === 5 && tree.distance <= 500) {
                    errors.push(error( // instancePath, message, type = 2, debugInfo = Null
                        instancePath,
                        'Kein stehendes Totholz aufgenommen',
                        1, 'checkTree_WZP4_820546=> tree:' + tree.tree_number
                        // ecke verwenden
                    ));

                }
                return errors;

            } */


        }


        /**
        * @function checkTree_WZP4_821411
        * @param {json} tree
        * @param {string} instancePath
        * @param {json} previous_tree
        * @returns {Array} errors
        * @author Thomas Stauber
        * 
        * Prüfung 821411
        * StHöhe > Höhe	Stammhöhe größer Baumhöhe	Stammhöhe größer Baumhöhe
        * ********************************************************************
        * Fehlertext: Stammhöhe ist größer als Baumhöhe
        */
        static checkTree_WZP4_821411 = async (tree, instancePath, previous_tree = {}) => {
            let errors = [];

            if (Number(tree.tree_status) < 2 && Number(tree.tree_height) < Number(tree.stem_height)) {

                errors.push(error( // instancePath, message, type = 1, debugInfo = Null
                    instancePath,
                    821411, // Fehlertext aus DB holen
                    'checkTree_WZP4_821411=> tree:' + tree.tree_number
                    // ecke verwenden
                ));


            }
            return errors;

        }

        /**
        * @function checkTree_WZP4_829914
        * @param {*} tree 
        * @param {*} instancePath 
        * @param {*} previous_tree 
        * @returns 
        * 
        * Prüfung: 829914 	Grenzstammkontrolle: Grenzkreis (Spalte 'GrenzToleranz') ist größer oder gleich Horizontalentfernung (Spalte 'Hori')	Baum gehört wegen Grenztoleranz zur Stichprobe 
        * obwohl 'Bk' = 8, oder 'Bk'=1111 ;  modifizieren Sie entweder 'Bk' = 8, oder 'Bk'=1111 'Hori' oder 'BHD'.
        *
        * Fehlertext: Die Grenztoleranz ist größer als die Horizontalentfernung (distance), Baum gehört zur Stichprobe. Ändern Sie entweder 'Bk' = 8, oder 'Bk'=1111 'Hori' oder 'BHD
        */
        static checkTree_WZP4_829914 = async (tree, instancePath, previous_tree = {}) => {

            let errors = [];
            var grenztoleranz = Calc.grenztoleranz(tree.dbh_height, tree.dbh);

            if (tree.distance < grenztoleranz && (tree.tree_status == 8 || tree.tree_status == 1111)) {

                errors.push(error( // instancePath, message, type = 1, debugInfo = Null
                    instancePath,
                    829914, // Fehlertext aus DB holen
                    'checkTree_WZP4_829914=> tree:' + tree.tree_number
                    //trakt und ecke verwenden
                ));

            }

            return errors;
        }


        /**
        * @function checkTree_WZP4_829925
        * @param {json} tree
        * @param {string} instancePath
        * @param {json} previous_tree
        * @returns {Array} errors
        * @author Thomas Stauber
        * 
        * Prüfung 829925
        * Höhe/Durchmesser unwahrscheinlich	Durchmesser - Höhe: Wert unwahrscheinlich (h/d-Verhältnis)	
        * Höhe/Durchmesser-Verhältnis > 140. Kontrollieren Sie Höhe  bzw. Höhe oder den Durchmesser)
        * ********************************************************************
        * Warnungs-Text: Höhe/Durchmesser-Verhältnis > 140, deshalb unwahrscheinlich 
        */
        static checkTree_WZP4_829925 = async (tree, instancePath, previous_tree = {}) => {
            let errors = [];
            if (Number(tree.tree_status) < 2 && Number(tree.tree_height) * 100 / Number(tree.dbh) > 140) {

                errors.push(error( // instancePath, message, type = 1, debugInfo = Null
                    instancePath,
                    829925, // Fehlertext aus DB holen
                    'checkTree_WZP4_829925=> tree:' + tree.tree_number
                    // ecke verwenden
                ));


            }
            return errors;

        }




        /**
            * @function checkTree_WZP4_820611_820612
            * @param {json} tree
            * @param {string} instancePath
            * @param {json} previous_tree
            * @returns {Array} errors
            * @author Thomas Stauber
            * 
            * Prüfung 820611, 820612
            * s. geringe Azi-Abweichung	Azimut (Spalte 'Azi') weicht von der Vorgängerinventur ab, aber nur sehr unbedeutend (< 5 gon)	Sehr geringe Abweichungen der Koordinaten sollten vermieden werden
            * ********************************************************************
            * Fehlertext: sehr geringe Azimut-Abweichung  von <=5 gon zur Vorgängerinventur 
            */
        static checkTree_WZP4_820611_820612 = async (tree, instancePath, previous_tree = {}) => {
            let errors = [];
            if (tree.tree_number === previous_tree.tree_number && Number(tree.tree_status) < 2 && Math.abs(Number(tree.azimuth) - Number(previous_tree.azimuth)) > 0 && Math.abs(Number(tree.azimuth) - Number(previous_tree.azimuth)) <= 5) {

                errors.push(error( // instancePath, message, type = 2, debugInfo = Null
                    instancePath,
                    820611, // Fehlertext aus DB holen
                    'checkTree_WZP4_820611_820612=> tree:' + tree.tree_number + ' Abweichung: ' + Math.abs(Number(tree.azimuth) - Number(previous_tree.azimuth))
                    // ecke verwenden
                ));

            }
            return errors;

        }



        /**
         * @function checkTree_WZP4_820711
         * @param {json} tree
         * @param {string} instancePath
         * @param {json} previous_tree
         * @returns {Array} errors
         * @author Thomas Stauber
         * 
         * Prüfung 820711
         * s. geringe Hori-Abweichung	Horizontalentfernung (Spalte 'Hori') weicht von der Vorgängerinventur ab, aber nur sehr gering (<10cm)
         * ********************************************************************
         * Fehlertext: geringe Hori-Abweichung < 10cm von der Vorgängerinventur
         */
        static checkTree_WZP4_820711 = async (tree, instancePath, previous_tree = {}) => {
            let errors = [];
            if (tree.tree_number === previous_tree.tree_number && Number(tree.tree_status) < 2 && Math.abs(Number(tree.distance) - Number(previous_tree.distance)) < 10 && Math.abs(Number(tree.distance) - Number(previous_tree.distance)) > 0) {

                errors.push(error( // instancePath, message, type = 2, debugInfo = Null
                    instancePath,
                    820711, // Fehlertext aus DB holen
                    'checkTree_WZP4_820711=> tree:' + tree.tree_number
                    // ecke verwenden
                ));

            }
            return errors;

        }




        /**
        * @function checkTree_WZP4_829921
        * @param {json} tree
        * @param {string} instancePath
        * @param {json} previous_tree
        * @returns {Array} errors
        * @author Thomas Stauber
        * 
        * Prüfung 829921
        * Höhenzuwachs unwahrscheinlich, Baumhöhe [dm]: Höhenzuwachs gegenüber Vorgängerinventur ungewöhnlich hoch (> 200 dm)
        * ********************************************************************
        * Fehlertext: Höhenzuwachs unwahrscheinlich, Höhenzuwachs zur Vorgängerinventur > 200dm
        */
        static checkTree_WZP4_829921 = async (tree, instancePath, previous_tree = {}) => {

            let errors = [];
            if (tree.tree_number === previous_tree.tree_number && Number(tree.tree_status) < 2 && Number(previous_tree.tree_status) < 2 && tree.tree_height != null && previous_tree.tree_height != null) {
                if (Number(tree.tree_height) - Number(previous_tree.tree_height) > 200) {

                    errors.push(error( // instancePath, message, type = 2, debugInfo = Null
                        instancePath,
                        829921, // Fehlertext aus DB holen
                        'checkTree_WZP4_829921=> tree:' + tree.tree_number
                        // ecke verwenden
                    ));
                }

            }

            return errors;
        }

        /**
        * @function checkTree_WZP4_820524
        * @param {json} tree
        * @param {string} instancePath
        * @param {json} previous_tree
        * @returns {Array} errors
        * @author Thomas Stauber
        *      
        * Prüfung 820524:  Die Probebaumkennziffer Bk darf nicht größer als 2000 sein	Der Baum wurde bei der Vorgängerinventur (Bk_Soll)
        * NICHT als ausgeschieden deklariert. Die Probebaumkennziffer Bk darf deshalb 
        * NICHT größer als 2000 sein (mit 2000 sind Bäume gekennzeichnet, die bei einer früheren Inventur ausgefallen sind).
        * ***************************************
        * Fehlermeldung: Die Probebaumkennziffer Bk darf nicht größer als 2000 sein, wenn der Baum in der Vorgängerinventur nicht ausgefallen ist
        */

        static checkTree_WZP4_820524 = async (tree, instancePath, previous_tree = {}) => {

            let errors = [];
            if (tree.tree_number === previous_tree.tree_number && Number(previous_tree.tree_status) < 2000 && Number(tree.tree_status) > 2000) {

                errors.push(error( // instancePath, message, type = 1, debugInfo = Null
                    instancePath,
                    820524, // Fehlertext aus DB holen
                    'checkTree_WZP4_820524=> tree:' + tree.tree_number
                    // ecke verwenden
                ));
            }

            return errors;
        }

        /**
        * @function checkTree_WZP4_820521
        * @param {json} plot
        * @param {string} instancePath
        * @param {json} previous_tree
        * @returns {Array} errors
        * @author Thomas Stauber
        * 
        * Prüfung 820521:    Die Probebaumkennziffer Bk muss wie Bk_Soll sein	Der Baum wurde schon bei einer Vorgängerinventur  
        * als ausgeschieden deklariert. Die vorinitialisierte Probebaumkennziffer Bk muss wie Bk_Soll sein.
        * ***************************************
        * 
        * Fehlermeldung:  Der Baum wurde schon bei einer Vorgängerinventur als ausgeschieden deklariert. 
        * Die Probebaumkennziffer Bk muss daher größer 2000 sein und Bk_Soll entsprechen
        */
        static checkTree_WZP4_820521 = async (tree, instancePath, previous_tree = {}) => {

            let errors = [];
            if (tree.tree_number === previous_tree.tree_number && Number(previous_tree.tree_status) > 2000 && Number(tree.tree_status) < 2000) {

                errors.push(error( // instancePath, message, type = 1, debugInfo = Null
                    instancePath,
                    820521, // Fehlertext aus DB holen
                    'checkTree_WZP4_820521=> tree:' + tree.tree_number
                    // ecke verwenden
                ));
            }

            return errors;
        }


        /**
        * @function checkTree_WZP4_820531_820532
        * @param {json} plot
        * @param {string} instancePath
        * @param {json} previous_plot
        * @returns {Array} errors
        * @author Thomas Stauber
        * 
        * Prüfung 820531 :  Die Probebaumkennziffer Bk war bei einer Vorgängerinventur ein Hilfsbaum (Pk=1111) und gehört jetzt zur Stichprobe	Der Baum war bei früheren Inventuren ein Hilfsbaum ohne Messwerte. Die vorinitialisierte Probebaumkennziffer Bk="1111" 
        * darf deshalb nur auf Pk=0  oder Pk=8 geändert werden, wenn der Baum neu zur Stichprobe gehört.
        * 
        * Prüfung  820532: Der Baum war bei der Vorgängerinventur kein Hilfsbaum (Pk!=1111) und ist nun ein Hilfsbaum
        * Der Baum wurde bei früheren Inventuren NICHT als (permanent markierter) Hilfsbaum interpretiert. 
        * Er ist auch heute nicht als permanent markierter Baum (Perm= '1') 
        * ohne Messwerte gekennzeichnet. Bk sollte deshalb NICHT auf "1111" gesetzt werden.
        * 
        * Fehlermeldung: Der Baum war bei der Vorgängerinventur kein Hilfsbaum (Pk!=1111) und ist nun ein Hilfsbaum
        */

        static checkTree_WZP4_820531_820532 = async (tree, instancePath, previous_tree = {}) => {

            let errors = [];
            if (tree.tree_number === previous_tree.tree_number && previous_tree.tree_status === '1111' && (tree.tree_status != 0 || tree.tree_status != 8)) {

                errors.push(error( // instancePath, message, type = 1, debugInfo = Null
                    instancePath,
                    820531, // Fehlertext aus DB holen
                    'checkTree_WZP4_820531_820532=> tree:' + tree.tree_number
                    // ecke verwenden
                ));
            }
            // Der Baum war bei der Vorgängerinventur kein Hilfsbaum (Pk!=1111) und ist nun ein Hilfsbaum
            if (tree.tree_number === previous_tree.tree_number && previous_tree.tree_status != '1111' && tree.tree_status === '1111') {

                errors.push(error( // instancePath, message, type = 1, debugInfo = Null
                    instancePath,
                    820532, // Fehlertext aus DB holen
                    'checkTree_WZP4_820531_820532=> tree:' + tree.tree_number
                    // ecke verwenden
                ));
            }

            return errors;
        }

        /**
         * 
         * @param {*} tree 
         * @param {*} instancePath 
         * @param {*} previous_tree 
         * @returns 
         * 
         * Prüfung: 829911 Grenzstammkontrolle bei Bk=1: Grenzkreis (Grenztoleranz) ist kleiner als  Horizontalentfernung 
         * (Hori)	Baum gehört nicht zur Stichprobe;  modifizieren Sie entweder 'Bk'=1, 'distance' oder 'dbh'.
         * 
         * Fehlertext: Die Grenztoleranz ist kleiner als die Horizontalentfernung (distance), Baum gehört nicht zur Stichprobe
         */
        static checkTree_WZP4_829911_829915 = async (tree, instancePath, previous_tree = {}) => {

            let errors = [];
            var grenztoleranz = Calc.grenztoleranz(tree.dbh_height, tree.dbh);

            if (tree.distance > grenztoleranz && (tree.tree_status == 1 || tree.tree_status == 0)) {

                errors.push(error( // instancePath, message, type = 1, debugInfo = Null
                    instancePath,
                    829911, // Fehlertext aus DB holen
                    'checkTree_WZP4_829911_829915=> tree:' + tree.tree_number
                    //trakt und ecke verwenden
                ));
            }

            return errors;
        }
        /**
            * @function checkTree_WZP4_820911
            * @param {json} plot
            * @param {string} instancePath
            * @returns {Array} errors
            * @author Thomas Stauber
            *      
            * Prüfung 820911:  Brusthöhendurchmesser bei Vorgängerinventur (Spalte 'BHD_V') grösser als / gleich dem bei aktueller Inventur (Spalte 'BHD')
            * ***************************************
            * Warnmeldung: Der BHD ist kleiner als bei der Vorgängerinventur
            */

        static checkTree_WZP4_820911 = async (tree, instancePath, previous_tree = {}) => {

            let errors = [];

            if (tree.tree_number === previous_tree.tree_number && tree.dbh != null && tree.dbh <= previous_tree.dbh) {

                errors.push(error( // instancePath, message, type = 1, debugInfo = Null
                    instancePath,
                    820911, // Fehlertext aus DB holen
                    'checkTree_WZP4_820533=> tree:' + tree.tree_number
                    //trakt und ecke verwenden
                ));
            }
            return errors;
        }

        /**
         * @function checkTree_WZP4_821318
         * @param {json} plot
         * @param {string} instancePath
         * @param {json} previous_plot
         * @returns {Array} errors
         * @author Thomas Stauber
         * 
         * Prüfung 821318:  die aktuelle Baumhöhe [dm] ist kleiner oder gleich als der bei der Vorgängerinventur gemessenen
         *  Kontrollieren Sie Ihre Höhenmessung
         * 
         * Fehlermeldung:  die aktuelle Baumhöhe [dm] ist kleiner oder gleich als der bei der Vorgängerinventur
         */

        static checkTree_WZP4_821318 = async (tree, instancePath, previous_tree = {}, api = null) => {

            let errors = [];
            if (tree.tree_status > 1) return;
            let is_error = false;
            // get speciesObject from lookup table
            const speciesObject = await api.lookupByAbbreviation('tree_species', tree.tree_species);

            // hier noch messtoleranzen für laub - einfügen, siehe Vorgänger
            if ( speciesObject ) {
                //nadelbäume
                if (speciesObject.taxonomy_order === 'N') {
                    if (tree.tree_number === previous_tree.tree_number && tree.tree_height != null && (tree.tree_height * 1.05) <= previous_tree.tree_height) {
                        is_error = true;
                    }
                }
                //laubbäume
                if (speciesObject.taxonomy_order === 'L') {
                    if (tree.tree_number === previous_tree.tree_number && tree.tree_height != null && (tree.tree_height * 1.1) <= previous_tree.tree_height) {
                        if (tree.tree_height > 200 && tree.tree_height <= 2000 && (tree.tree_height + 20) <= previous_tree.tree_height) {
                            is_error = true;
                        }
                        if (tree.tree_height > 0 && tree.tree_height <= 199 && (tree.tree_height * 1.1) <= previous_tree.tree_height) {
                            is_error = true;
                        }

                    }
                }

                if (is_error) {

                    errors.push(error( // instancePath, message, type = 1, debugInfo = Null
                        instancePath,
                        821318, // Fehlertext aus DB holen
                        'checkTree_WZP4_821318=> tree:' + tree.tree_number
                        //trakt und ecke verwenden
                    ));
                }
            }
            else {
                errors.push(error(
                    instancePath,
                    `Tree type ${tree.tree_species} not found in lookup Table`,
                    1));

            }
            return errors;

        }


        /**
        * @function checkTree_WZP4_820913
        * @param {json} plot
        * @param {string} instancePath
        * @param {json} previous_plot
        * @returns {Array} errors
        * @author Thomas Stauber
        * 
        * Prüfung 820913: (auf 130cm Messhöhe umgerechneter) Brusthöhendurchmesser (Spalte 'Bhd130') < 70mm	Baum gehört nicht zur WZP-Stichprobe
        *
        * Fehlermeldung:  Ein auf 130cm Messhöhe umgerechneter Brusthöhendurchmesser ist kleiner als 70mm und  gehört damit nicht zur WZP-Stichprobe
        */

        static checkTree_WZP4_820913 = async (tree, instancePath, previous_tree = {}) => {

            let errors = [];


            // Bäume, aktuell und Vorgänger

            if (tree.tree_marked === false && tree.tree_status != 8 && tree.dbh != null && tree.dbh < 70) {

                errors.push(error( // instancePath, message, type = 1, debugInfo = Null
                    instancePath,
                    820913, // Fehlertext aus DB holen
                    'checkTree_WZP4_820913=> tree:' + tree.tree_number
                    //trakt und ecke verwenden
                ));
            }

            return errors;
        }


        /**
        * @function checkTree_WZP4_821315
        * @param {json} plot
        * @param {string} instancePath
        * @param {json} previous_plot
        * @returns {Array} errors
        * @author Thomas Stauber
        * 
        * Prüfung 821315: Es ist ein Höhenbaum aus der Vorgängerinventur nicht  als erneuter Höhenmessbaum für den Hauptbestand verwendet worden	
        * EINSICHTIGE, geeignete  (Spalte 'H-Eignung' = +), bereits bei einer Vorgängerinventur aufgenommene Höhenmessbäume (Spalte 'HöheMBV)
        * der Hauptschicht (Bs=1) sollen wieder bevorzugt aufgenommen werden.
        *
        * Fehlermeldung:  Ein Höhenbaum aus der Vorgängerinventur ist nicht als erneuter Höhenmessbaum verwendet worden
        */
        static checkTree_821315 = async (tree, instancePath, previous_tree = {}) => {

            let errors = [];


            // Bäume, aktuell und Vorgänger
            /* Höheneignung kann nicht geprüft werden, Funktion zu Berechnung eines geeigneten Höhenmessbaums unter Berücksichtigung 
            der Grenztoleranz muss noch implementiert werden; */

            //fügt h_suitability (Eignung als Höhenmessbaum) in tree ein

            if (Calc.height_suitability(tree)) {

                if (tree.tree_number === previous_tree.tree_number && tree.tree_status < 2 && previous_tree.tree_status < 2 && tree.tree_height === null && previous_tree.tree_height != null) {

                    errors.push(error( // instancePath, message, type = 1, debugInfo = Null
                        instancePath,
                        821315, // Fehlertext aus DB holen
                        'checkTree_821315=> tree:' + tree.tree_number
                        //trakt und ecke verwenden
                    ));
                }
            }

            return errors;
        }

        // ----------------------- System Functions -----------------------

        static className = "Trees";




    }

    class Plausibility {

        constructor(host, apikey) {
            this.api = new API(host, apikey);
        }

        /**
        * 
        * @description Run all functions in given class
        * @param {class} ClassToRun
        * @param {json} parentArray 
        * @returns {Array} errors
        * @author Gerrit Balindt <gerrit.balindt@thuenen.de>
        */
        runAll = async (ClassToRun, object, instancePath = '', previous_object= {}) =>{

            let errors = [];

            // Run all functions in this class
            const keys =  Object.keys(ClassToRun);
            for (let j = 0; j < keys.length; j++) {
                if(ClassToRun[keys[j]] instanceof Function){
                    const newErrors = await ClassToRun[keys[j]](object, instancePath, previous_object, this.api);
                    if(newErrors && newErrors.length > 0)
                        errors = [ ...errors, ...newErrors];
                }
            }
            
            return errors;
        }
        async runCluster(clusters, instancePath = '/clusters', previous_cluster = {}) {
            return new Promise(async (resolve, reject) => {
                if (!Cluster) {
                    reject('Cluster is not defined');
                    return;
                }
                if (!Array.isArray(clusters)) {
                    reject('Clusters should be an array');
                    return;
                }
                if (!previous_cluster || !Array.isArray(previous_cluster)) {
                    previous_cluster = [];
                }
                let errors = [];
                console.log(clusters.length);
                // Loop through all
                for (let i = 0; i < clusters.length; i++) {
                    
                    errors = [...errors, ...await this.runAll(Cluster, clusters[i], instancePath + `/${i}`, previous_cluster[i])];
                    // if (errors.length === 0 && clusters[i].plot) {
                        if ( clusters[i].plot) {
                        errors = [...errors, ...await this.runPlots(clusters[i].plot, instancePath + `/plot`, previous_cluster[i]?.plot || {})];
                    }
                }    
                if (errors.length > 0) {
                    reject(errors);
                }
                resolve(errors);
            });
        }
        async runPlots(plots, instancePath = '', previous_plot) {
            if (!Plots) {
                throw new Error('Cluster is not defined');
            }
            let errors = [];

            // Loop through all
            for (let i = 0; i < plots.length; i++) {
                
                errors = [...errors, ...await this.runAll(Plots, plots[i], instancePath + `/${i}`, previous_plot[i])];
                //if (errors.length === 0 && plots[i].tree) {
                    if ( plots[i].tree) {
                   errors = [...errors, ...await this.runTrees(plots[i].tree, instancePath + `/tree`, previous_plot[i]?.tree || {})];
                }
            }
            
            return errors;
        }
        async runTrees(trees, instancePath = '', previous_trees) {
            if (!Plots) {
                throw new Error('Cluster is not defined');
            }
            let errors = [];

            // Loop through all
            for (let i = 0; i < trees.length; i++) {
                errors = [...errors, ...await this.runAll(Trees, trees[i], instancePath + `/${i}`, previous_trees[i])];
               
            }

            return errors;
        }
    }

    return Plausibility;

}));
