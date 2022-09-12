const ApiClient = require('../api');
const { isUndefined } = require('lodash');
const { MissingParamError } = require('../../errors');

class Workflow {
  constructor(settings, user) {
    const headers = {
      // eslint-disable-next-line camelcase
      Authorization: `bearer ${user.access_token}`,
      'Content-type': 'application/json'
    };
    Object.defineProperty(this, 'client', { value: ApiClient(settings, { headers }) });
    Object.defineProperty(this, 'profile', {
      get() {
        return user.profile || {};
      }
    });
  }

  validate(data, ...params) {
    params.forEach(param => {
      if (isUndefined(data[param])) {
        throw new MissingParamError(param);
      }
    });
  }

  _pack(params) {
    return {
      ...params,
      changedBy: this.profile.id
    };
  }

  create(params) {
    this.validate(params, 'model');
    const { data = {}, meta = {}, model, establishmentId } = params;
    return this.client('/', {
      method: 'POST',
      json: this._pack({
        data,
        meta,
        model,
        establishmentId,
        action: 'create'
      })
    });
  }

  update(params) {
    this.validate(params, 'id', 'model');
    const { data = {}, meta = {}, model, id, action, establishmentId } = params;
    return this.client('/', {
      method: 'POST',
      json: this._pack({
        data,
        meta,
        model,
        id,
        establishmentId,
        action: action || 'update'
      })
    });
  }

  delete(params) {
    this.validate(params, 'id', 'model');
    const { data = {}, id, model, meta, establishmentId } = params;
    return this.client('/', {
      method: 'POST',
      json: this._pack({
        data,
        id,
        model,
        meta,
        establishmentId,
        action: 'delete'
      })
    });
  }

  task(taskId) {
    return {
      read: () => this.client(`/${taskId}`),
      comment: ({ comment, meta }) => {
        this.validate({ comment, taskId }, 'comment', 'taskId');
        return this.client(`/${taskId}/comment`, {
          method: 'POST',
          json: this._pack({
            comment,
            meta
          })
        });
      },
      updateComment: ({ id, comment, meta }) => {
        this.validate({ id, comment, taskId }, 'id', 'comment', 'taskId');
        return this.client(`/${taskId}/comment/${id}`, {
          method: 'PUT',
          json: this._pack({
            comment,
            meta
          })
        });
      },
      deleteComment: ({ id }) => {
        this.validate({ id }, 'id');
        return this.client(`/${taskId}/comment/${id}`, {
          method: 'DELETE'
        });
      },
      status: ({ status, meta, data }) => {
        this.validate({ status, taskId }, 'status', 'taskId');
        return this.client(`/${taskId}/status`, {
          method: 'PUT',
          json: this._pack({
            status,
            meta,
            data
          })
        });
      },
      extend: ({ comment }) => {
        this.validate({ comment }, 'comment');
        return this.client(`/${taskId}`, {
          method: 'PUT',
          query: { preserveUpdatedAt: true },
          json: this._pack({
            data: {
              deadline: {
                isExtended: true,
                isExtendable: false
              }
            },
            meta: { comment }
          })
        });
      },
      removeDeadline: ({ comment }) => {
        this.validate({ comment }, 'comment');
        return this.task(taskId).read().then(response => {
          const task = response.json.data;
          return this.client(`/${taskId}`, {
            method: 'PUT',
            query: { preserveUpdatedAt: true },
            json: this._pack({
              data: {
                deadline: null,
                removedDeadline: task.data.deadline
              },
              meta: {
                comment,
                isRemoved: true
              }
            })
          });
        });
      },
      reinstateDeadline: ({ comment }) => {
        this.validate({ comment }, 'comment');
        return this.task(taskId).read().then(response => {
          const task = response.json.data;
          return this.client(`/${taskId}`, {
            method: 'PUT',
            query: { preserveUpdatedAt: true },
            json: this._pack({
              data: {
                deadline: task.data.removedDeadline,
                removedDeadline: null
              },
              meta: {
                comment,
                isReinstated: true
              }
            })
          });
        });
      },
      exemption: ({ isExempt, reason }) => {
        this.validate({ reason }, 'reason');
        return this.client(`/${taskId}`, {
          method: 'PUT',
          json: this._pack({
            data: {
              deadline: {
                exemption: {
                  isExempt,
                  reason
                }
              }
            }
          })
        });
      },
      assign: ({ profileId }) => {
        this.validate({ profileId }, 'profileId');
        return this.client(`/${taskId}/assign`, {
          method: 'PUT',
          json: this._pack({ profileId })
        });
      }
    };
  }

  profileTasks(profileId, establishmentId) {
    const query = {
      model: 'profile-touched',
      modelId: profileId,
      onlyOpen: true,
      establishmentId
    };
    return this.related({ query });
  }

  list({ query }) {
    return this.client('/', { query });
  }

  openTasks(modelId) {
    return this.client(`/open-tasks/${modelId}`);
  }

  related({ query }) {
    return this.client('/related-tasks/', { query });
  }

  deadlinePassed({ query }) {
    return this.client('/deadline-passed/', { query });
  }

  filtered({ query }) {
    return this.client('/filtered-tasks/', { query });
  }
}

module.exports = Workflow;
