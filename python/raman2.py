
class DeferResumeTasks(generics.GenericAPIView):
    """
    Defer/Resume tasks
    ---
    GET:
        parameters:
            - name: status
              required: true
              description: The new status of the task
              paramType: path
            - name: data
              required: false
              description: data of the tasks viz. email, task_tracking_ids and additional time
              paramType: body
    """
    serializer_class = ActiveTaskV2Serializer

    @swagger_auto_schema(request_body=ChangeTasksStatusSerializer,
                         responses={'200': ReadOnlyActiveTaskV2Serializer(many=True)})
    def patch(self, request, *args, **kwargs):
        task_tracking_ids = request.data.get('task_tracking_ids', [])
        additional_time = request.data.get('additional_time',
                                           TaskActiveV2.default_additional_time_in_seconds)
        email = request.data.get('email')
        task_status = self.kwargs.get('status')

        is_updated, data = defer_resume_tasks_helper(email, task_tracking_ids, additional_time, task_status)
        if is_updated and not data:
            return Response(status=status.HTTP_200_OK, data=data)
        elif is_updated and data:
            return Response(status=status.HTTP_412_PRECONDITION_FAILED, data=data)
        else:
            return Response(status=status.HTTP_404_NOT_FOUND, data=data)


class DeleteTasks(generics.GenericAPIView):
    """
    Delete tasks
    ---
    GET:
        parameters:
            - name: data
              required: false
              description: data of the tasks viz. email and task_tracking_ids
              paramType: body
    """
    serializer_class = ActiveTaskV2Serializer

    @swagger_auto_schema(request_body=DeleteTasksSerializer,
                         responses={'200': ReadOnlyActiveTaskV2Serializer(many=True)})
    def delete(self, request, *args, **kwargs):
        task_tracking_ids = request.data.get('task_tracking_ids', [])
        email = request.data.get('email')

        deleted, data = delete_tasks_helper(email, task_tracking_ids)
        if deleted and not data:
            return Response(status=status.HTTP_200_OK, data=data)
        elif deleted and data:
            return Response(status=status.HTTP_412_PRECONDITION_FAILED, data=data)
        else:
            return Response(status=status.HTTP_404_NOT_FOUND, data=data)


class MarkTasksForKill(generics.GenericAPIView):
    """
    Mark tasks for getting killed by scheduler
    ---
    GET:
        parameters:
            - name: status
              required: true
              description: The new status of the task
              paramType: path
            - name: data
              required: false
              description: data of the tasks viz. email and task_tracking_ids
              paramType: body
    """
    serializer_class = ActiveTaskV2Serializer

    @swagger_auto_schema(request_body=ChangeTasksStatusSerializer,
                         responses={'200': ReadOnlyActiveTaskV2Serializer(many=True)})
    def patch(self, request, *args, **kwargs):
        task_status = self.kwargs.get('status')
        serializer = ChangeTasksStatusSerializer(data=request.data)

        if serializer.is_valid(raise_exception=True):
            is_updated, data = kill_tasks_helper(serializer.data['email'],
                                                 serializer.data['task_tracking_ids'],
                                                 task_status)
            if is_updated and not data:
                return Response(status=status.HTTP_200_OK, data=data)
            elif is_updated and data:
                return Response(status=status.HTTP_412_PRECONDITION_FAILED, data=data)
            else:
                return Response(status=status.HTTP_404_NOT_FOUND, data=data)

        return Response(status=status.HTTP_400_BAD_REQUEST, data=[])