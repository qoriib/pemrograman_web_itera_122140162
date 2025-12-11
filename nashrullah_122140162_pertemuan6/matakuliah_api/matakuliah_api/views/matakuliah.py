import json
from pyramid.view import view_config
from pyramid.httpexceptions import HTTPNotFound, HTTPBadRequest
from sqlalchemy.exc import IntegrityError

from ..models import Matakuliah


@view_config(route_name='home', renderer='json')
def home(_request):
    return {'status': 'ok', 'message': 'Matakuliah API ready'}


@view_config(route_name='matakuliah_list', renderer='json')
def list_matakuliah(request):
    items = request.dbsession.query(Matakuliah).all()
    return {'matakuliah': [item.to_dict() for item in items]}


@view_config(route_name='matakuliah_detail', renderer='json')
def get_matakuliah(request):
    try:
        mk_id = int(request.matchdict.get('id'))
    except (TypeError, ValueError):
        return HTTPBadRequest(json_body={'error': 'id harus berupa angka'})

    item = request.dbsession.query(Matakuliah).get(mk_id)
    if item is None:
        return HTTPNotFound(json_body={'error': 'Matakuliah tidak ditemukan'})
    return {'matakuliah': item.to_dict()}


@view_config(route_name='matakuliah_create', request_method='POST', renderer='json')
def create_matakuliah(request):
    try:
        data = request.json_body
    except (ValueError, json.JSONDecodeError):
        return HTTPBadRequest(json_body={'error': 'Body harus berupa JSON valid'})

    required = ['kode_mk', 'nama_mk', 'sks', 'semester']
    missing = [field for field in required if field not in data]
    if missing:
        return HTTPBadRequest(json_body={'error': f'Field wajib: {", ".join(missing)}'})

    try:
        mk = Matakuliah(
            kode_mk=data['kode_mk'],
            nama_mk=data['nama_mk'],
            sks=int(data['sks']),
            semester=int(data['semester']),
        )
        request.dbsession.add(mk)
        request.dbsession.flush()  # to populate id
    except (ValueError, TypeError):
        return HTTPBadRequest(json_body={'error': 'sks dan semester harus angka'})
    except IntegrityError:
        request.dbsession.rollback()
        return HTTPBadRequest(json_body={'error': 'kode_mk sudah digunakan'})

    return {'success': True, 'matakuliah': mk.to_dict()}


@view_config(route_name='matakuliah_update', request_method='PUT', renderer='json')
def update_matakuliah(request):
    try:
        mk_id = int(request.matchdict.get('id'))
    except (TypeError, ValueError):
        return HTTPBadRequest(json_body={'error': 'id harus berupa angka'})

    item = request.dbsession.query(Matakuliah).get(mk_id)
    if item is None:
        return HTTPNotFound(json_body={'error': 'Matakuliah tidak ditemukan'})

    try:
        data = request.json_body
    except (ValueError, json.JSONDecodeError):
        return HTTPBadRequest(json_body={'error': 'Body harus berupa JSON valid'})

    # Update fields when provided
    if 'kode_mk' in data:
        item.kode_mk = data['kode_mk']
    if 'nama_mk' in data:
        item.nama_mk = data['nama_mk']
    if 'sks' in data:
        try:
            item.sks = int(data['sks'])
        except (ValueError, TypeError):
            return HTTPBadRequest(json_body={'error': 'sks harus angka'})
    if 'semester' in data:
        try:
            item.semester = int(data['semester'])
        except (ValueError, TypeError):
            return HTTPBadRequest(json_body={'error': 'semester harus angka'})

    try:
        request.dbsession.flush()
    except IntegrityError:
        request.dbsession.rollback()
        return HTTPBadRequest(json_body={'error': 'kode_mk sudah digunakan'})

    return {'success': True, 'matakuliah': item.to_dict()}


@view_config(route_name='matakuliah_delete', request_method='DELETE', renderer='json')
def delete_matakuliah(request):
    try:
        mk_id = int(request.matchdict.get('id'))
    except (TypeError, ValueError):
        return HTTPBadRequest(json_body={'error': 'id harus berupa angka'})

    item = request.dbsession.query(Matakuliah).get(mk_id)
    if item is None:
        return HTTPNotFound(json_body={'error': 'Matakuliah tidak ditemukan'})

    request.dbsession.delete(item)
    return {'success': True, 'message': f'Matakuliah dengan id {mk_id} dihapus'}
