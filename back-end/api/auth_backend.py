from rest_framework_simplejwt.authentication import JWTAuthentication
from api.models import User  # import your model
from rest_framework.exceptions import AuthenticationFailed

class CustomJWTAuthentication(JWTAuthentication):
    def get_user(self, validated_token):
        try:
            user_id = validated_token.get('user_id')
            if user_id is None:
                raise AuthenticationFailed('Token contained no user ID')

            user = User.objects.get(id=user_id)
            return user

        except User.DoesNotExist:
            raise AuthenticationFailed('User not found')
