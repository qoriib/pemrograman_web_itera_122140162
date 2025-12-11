def includeme(config):
    config.add_route('home', '/')
    config.add_route('matakuliah_list', '/api/matakuliah', request_method='GET')
    config.add_route('matakuliah_detail', '/api/matakuliah/{id}', request_method='GET')
    config.add_route('matakuliah_create', '/api/matakuliah', request_method='POST')
    config.add_route('matakuliah_update', '/api/matakuliah/{id}', request_method='PUT')
    config.add_route('matakuliah_delete', '/api/matakuliah/{id}', request_method='DELETE')
