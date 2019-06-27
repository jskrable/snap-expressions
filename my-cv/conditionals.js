
// getFacultyFromMyCV
// conditionalMapAppointmentLists

$person.native.field.filter(x => x['@name'] == 'academic-appointments')
    .map(y => {'type': 'Academic',
                'record_id': $person.record_id,
                'privacy': y['academic-appointments']['academic-appointment']['@privacy'],
                'position': y['academic-appointments']['academic-appointment']['position'],
                'start_date': y['academic-appointments']['academic-appointment']['start-date'],
                'end_date': y['academic-appointments']['academic-appointment']['end-date'],
                'institution': y['academic-appointments']['academic-appointment']['institution']['line']
                    .toObject(x => x['@type'], y=> y['#text'])

           })


$person.native.field.filter(x => x['@name'] == 'non-academic-employments')
    .map(y => {'type': 'Professional',
                'record_id': $person.record_id,
                'privacy': y['non-academic-employments']['non-academic-employment']['@privacy'],
                'position': y['non-academic-employments']['non-academic-employment']['position'],
                'start_date': y['non-academic-employments']['non-academic-employment']['start-date'],
                'end_date': y['non-academic-employments']['non-academic-employment']['end-date'],
                'institution': y['non-academic-employments']['non-academic-employment']['employer']['line']
                    .toObject(x => x['@type'], y=> y['#text'])

           })